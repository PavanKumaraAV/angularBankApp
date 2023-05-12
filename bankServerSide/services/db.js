// import mongoose
const mongoose = require('mongoose')

//defining connection string
mongoose.connect('mongodb://localhost:27017/bank')

//to create collection/model

const User = mongoose.model('User', {
    acno : Number,
    username : String,
    password : String,
    balance : Number, 
    transaction : [],
    
})

//export the model

module.exports = {
    User
}