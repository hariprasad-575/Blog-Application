const express=require('express')
const path=require('path')
const mongoose=require('mongoose')
const cookieParser=require('cookie-parser')

//models
const Blog=require('./models/blog')


// Routes
const userRoutes=require('./routes/user')
const blogRoutes=require('./routes/blog')
const { checkForAuthenticationCookie } = require('./middleware/authentication')


const app = express()

const port=8000

//Middleware
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.resolve('./public')))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))

app.set('view engine','ejs')
app.set('views',path.resolve("./views"))


app.get('/',async (req,res)=>{
    const allBlogs=await Blog.find({}); 
    // console.log(req.user);
    res.render('home',{
        user:req.user,
        blogs:allBlogs,
    });
})
app.use('/user',userRoutes)
app.use('/blog',blogRoutes)


mongoose.connect('mongodb://localhost:27017/blogify').then(e=>{
    console.log("MONGODB CONNECTED")
})
app.listen(port,()=>{
    console.log(`Server started at http://localhost:${port}`)
})
