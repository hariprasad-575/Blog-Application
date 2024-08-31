const mongoose=require('mongoose')
const {createHmac,randomBytes}=require('crypto');
const { createTokenUser } = require('../services/authentication');
const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    profileImgUrl:{
        type:String,
        default:'/images/default.png'
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER"
    },
    visitHistory:[{timestamp:{type:Number}}]
},
{timestamp:true}
);
userSchema.pre('save',function(next){
    const user=this
    if(!user.isModified("password")) return ;

    const salt='SomerandomSalt';
    const hashedPassword=createHmac('sha256',salt).update(user.password).digest("hex")

    this.salt=salt;
    this.password=hashedPassword
    next();

})

userSchema.static('matchPasswordandreturnToken',async function(email,password){
   const user =await this.findOne({email}) 
   if(!user) throw new Error("User not found");

   const salt=user.salt;
   const hashedPassword=user.password;

   const userProvidedPassword=createHmac('sha256',salt).update(password).digest("hex")
   if(hashedPassword!==userProvidedPassword) throw new Error("Incorrect Password")

   const token=createTokenUser(user);
   return token;
})


const URL=mongoose.model('user',userSchema)

module.exports=URL