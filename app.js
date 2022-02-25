require('dotenv').config({
    debug: true
})
const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const port = process.env.Port || 3000;

const app = express()

//Config
app.use(express.json())


//Models

const User = require("./models/User.js")

//Public Route
app.get("/", (req, res) => {
    res.status(200).json({
        msg: "Welcome to the StockyAPI!"
    })
})

//Register User
app.post("/auth/register", async (req, res) => {
    const {
        name,
        email,
        password,
        confirmpassword
    } = req.body

    //Val
    if (!name) {
        return res.status(422).json({
            msg: "Name is required"
        })
    }
    if (!email) {
        return res.status(422).json({
            msg: "Email is required"
        })
    }
    if (!password) {
        return res.status(422).json({
            msg: "Password is required"
        })
    }

    if (password !== confirmpassword) {
        return res.status(422).json({
            msg: "Incorrect Password"
        })
    }

    //Check if user exists on Database

    const userExists = await User.findOne({
        email: email
    })
    if (userExists) {
        return res.status(422).json({
            msg: "Email already taken"
        })
    }

    //Create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //Create User

    const user = new User({
        name,
        email,
        password: passwordHash,
    })

    try {
        await user.save()
        res.status(201).json({
            msg: "User added to StockyDB"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Error detected"
        })

    }
})

app.post("/auth/login", async (req, res) => {

    const {
        email,
        password
    } = req.body

    //Val
    if (!email) {
        return res.status(422).json({
            msg: "Email is required"
        })
    }
    if (!password) {
        return res.status(422).json({
            msg: "Password is required"
        })
    }

    //Check if user exists on Database

    const user = await User.findOne({
        email: email
    })
    if (!user) {
        return res.status(404).json({
            msg: "User doesn't exists"
        })
    }

    //Check if password matches

    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
        return res.status(422).json({
            msg: "Invalid Password"
        })
    }

    try {
        const secret = process.env.SECRET

        const token = jwt.sign({
            id: user._id
        }, secret)
        
        res.status(200).json({msg : `Login Successful`,token})

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Error detected"
        })

    }

})

//Credentials
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS


mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.xoha1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`).then(() => {
    app.listen(3000)
    console.log("Connected to the StockyDB")
}).catch((err) => console.log(err))