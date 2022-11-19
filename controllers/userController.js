const User = require("../models/userModel");
const bcrypt =  require('bcrypt');

const securePassword = async(password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}

const loadLogin = async(req,res) =>{
    try{
        res.render('login');
    } catch(error) {
        console.log(error.message);
    }
}

const verifyLogin =  async(req,res) => {
    try {
       const email = req.body.email;
       const password = req.body.paasword;       
       const userData = await User.findOne({email:email}); 
       console.log(userData);
       if(!(await bcrypt.compare(password, User.password))) {
        res.render("index", {error: true})
    }

    } catch (error) {
        console.log(error.message);
    }
}

const insertUser =  async(req,res) => {
    try{
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: spassword,
        })

        const userData = await user.save();

        console.log(userData);
        if(userData){
            res.render('register',{message:"your registration haas been successfull"});
        } 
        else{
            res.render('register',{message:"Your Registration Successful"});
        }
    } catch(error){
        console.log(error.message);
    }
}

const loadRegister = async(req,res) => {
    try{
        res.render('register');
    } catch(error) {
        console.log(error.message);
    }
}

const loadHome = async(req,res) => {
    try {
        res.render('index');
    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    loadLogin,
    verifyLogin,
    insertUser,
    loadRegister,
    loadHome
}