const express=require('express')
const User=require('../models/user')
const router=express.Router();

router.get('/signin',(req,res)=>{
    return res.render('signin')
})
router.post('/signin',async(req,res)=>{
    const{email,password}=req.body;
    try{
        // console.log(email,password)
        const token=await User.matchPasswordandreturnToken(email,password);
        // console.log(token);
        return res.cookie('token',token).redirect('/')
    }
    catch(error){
        return res.render('signin',{
            "error":"Incorrect password"
        })
    }
    
})
router.get('/logout',(req,res)=>{
    res.clearCookie("token").redirect('/');
})

router.get('/signup',(req,res)=>{
    return res.render('signup')
})
router.post('/signup',async(req,res)=>{
    // return res.render('signup')
    // console.log(req.body);
    const {fullName,email,password}=req.body
    await User.create({
        fullName,
        email,
        password
    })
    return res.redirect('/')
})

module.exports=router;