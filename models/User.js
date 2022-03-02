const mongoose = require("mongoose")

const User = mongoose.model("User", {
    username:String,
    email:String,
    password:String,
    portfolio: Array
})

module.exports = User