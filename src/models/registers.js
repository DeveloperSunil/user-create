const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// create schema
const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    qualification:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

//  genrating token with the help of method we can define the generatetokenmethod
userSchema.methods.generateAuthToken = async function(){
    try{
        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()},"mynameissunilpatelfromdewasiamgood");
        this.tokens = this.tokens.concat({token:token});
        await this.save();//add to database
        return token;
    }catch(error){
        res.send("the error part"+error);
        console.log("the error part"+error);
    }
}

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        console.log(`the current password is ${this.password}`);
        this.password = await bcrypt.hash(this.password,10);
        this.confirmpassword = await bcrypt.hash(this.password,10);
        console.log(`the current password is ${this.password}`);
    }
    next();
})

// now we need to create a collection
const Register = new mongoose.model("Register",userSchema);
module.exports = Register;
