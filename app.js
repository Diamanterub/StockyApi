require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const port = process.env.Port || 3002;
const users = require('./routes/route_users')
const stocks = require("./routes/routes_stocks")
const utilities = require('./utilities/utilities')

const app = express()

//Config
app.use(express.json())


//Models

const User = require("./models/User.js")

const auth = function(req, res, next) {
    let exceptions = ['/login', '/register']; 
    if(exceptions.indexOf(req.url) >= 0) {
        next(); 
    } else {
        utilities.validateToken(req.headers.authorization, (result) => {
            if(result) {
                next(); 
            } else {
                res.status(401).send("Invalid Token"); 
            }
        })
    }
}

app.use(express.json());
app.use(auth); 
app.use('/', users)
app.use("/stocks",stocks)



//Public Route
app.get("/", (req, res) => {
    res.status(200).json({
        msg: "Welcome to the StockyAPI!"
    })
})

//Credentials
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS


mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.xoha1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`).then(() => {
    app.listen(3000)
    console.log("Connected to the StockyDB")
}).catch((err) => console.log(err))

app.listen(port, function() {
    console.log("App is running on port " + port)
})  