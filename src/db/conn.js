// connection 
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:urkRapQ6xQ8Zs21G@cluster0.lew8o.mongodb.net/userdb?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>{
    console.log('connection succesful');
}).catch((error)=>{
    console.log("no connection")
});


