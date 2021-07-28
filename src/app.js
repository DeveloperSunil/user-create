const express = require('express');
const path = require('path');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('./db/conn');
const  Register = require("./models/registers");
// const hbs = require('hbs');
const port = process.env.PORT || 3000;

const static_path = path.join(__dirname,"../public")
const template_path = path.join(__dirname,"../templates/views");
// const partials_path = path.join(__dirname,"../templates/partials");
// use static path
app.use(express.static(static_path));

app.use(express.json());
app.use(express.urlencoded({ extended:false}));// get data from from dont see undefined;
//set the view engine
app.set("view engine","hbs");
app.set("views",template_path);
// hbs.registerPartials(partials_path);

app.get('/',(req, res)=>{
    res.render("index");
});



// create a new user in our database
app.post('/register',async(req, res)=>{
        try{
            const password = req.body.password;
            const cpassword = req.body.confirmpassword;
            if(password === cpassword){
                const registerUser = new Register({
                    firstname:req.body.firstname,
                    age:req.body.age,
                    address:req.body.address,
                    qualification:req.body.qualification,
                    email:req.body.email,
                    password:password,
                    confirmpassword:req.body.confirmpassword,
                }); 
                
                const token = await registerUser.generateAuthToken();
                console.log("the token part" + token);
                // password hash
                
                const registered = await registerUser.save();
                res.status(201).render("success");
            }else{
                res.send("password are not matching");
            }


        }catch(error){
            res.status(400).send(error);
        }
})

// login check
app.post('/login',async(req, res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        console.log(`${email} and ${password}`);
        const useremail = await Register.findOne({email:email});
        // res.send(useremail.password);
        // // console.log(useremail);

        const isMatch = await bcrypt.compare(password,useremail.password); // true or false
        console.log(isMatch);
        const token = await useremail.generateAuthToken();
        console.log("the token part" + token);
        
        if(isMatch){
            console.log(useremail.firstname);
            const data = {
                name:useremail.firstname,
            }
            res.status(201).render("dashboard",{data});
        }else{
            res.send("invalid Login Detail");
        }

    }catch(error){
        res.status(400).send("invalid Login Detail");
    }
})

// // read data 
// app.get('/register',async (req, res)=>{
//     // res.render("register");
//     try{
//         const email = req.body.email;
//         const userdata = await Register.findOne({email:email});
//         if(userdata)
//     }catch(error){

//     }
// });


app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})