const express = require("express");
const user_route = express();

user_route.set('view engine','ejs');
user_route.set('views','./views')

const bodParser = require('body-parser');
user_route.use(bodParser.json());
user_route.use(bodParser.urlencoded({extended:true}));

const userController = require("../controllers/userController");

user_route.get('/login',userController.loadLogin);
user_route.post('/login',userController.verifyLogin);
user_route.get('/index',userController.loadHome);
user_route.post('/register',userController.insertUser);
user_route.get('/register',userController.loadRegister);

module.exports = user_route;