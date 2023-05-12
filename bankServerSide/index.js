//import express in index.js file 
const express = require('express')

//import cors
const cors = require('cors')

const logic = require("./services/logic")

const jwt = require('jsonwebtoken')



//create server app using express
const server = express()

//using cors specify the origin to server app that should share data
server.use(cors({
    origin: 'http://localhost:4200'
}))

//use json parser in server app
server.use(express.json())


//set up port number for server app
server.listen(3000, () => console.log("server is running at port 3000"))

// token verification middle ware
const jwtMiddleware = (req, res, next) => {
    console.log("Router specific middle ware");
    //get token from request headers
    const token = req.headers['verify-token']
    console.log(token);
    try {
        const data = jwt.verify(token, "supersecretkey123")
        console.log(data);
        req.currentAcno = data.loginAcno
        next()
    }
    catch {
        res.status(404).json({ message: "Please Login" })
    }
}
//bank register
server.post('/register', (req, res) => {
    console.log(req.body);
    logic.register(req.body.acno, req.body.uname, req.body.pswd)
        .then((result) => {
            res.status(result.statusCode).json(result)
        })
})

//login
server.post('/login', (req, res) => {
    console.log("Inside login api");
    console.log(req.body);
    logic.login(req.body.acno, req.body.pswd)
        .then((result) => {
            console.log(result)
            res.status(result.statusCode).json(result)
        })
    // get acno and pswd from req
    // calll login method in logic.js
    // send response to client
})


server.get('/getBalance/:acno', jwtMiddleware, (req, res) => {
    logic.getBalance(req.params.acno).then((result) => {
        res.status(result.statusCode).json(result)
    })

})

server.post('/fundtransfer', jwtMiddleware, (req, res) => {
    console.log(req.body.pswd)
    logic.fundTransfer(req.currentAcno, req.body.pswd, req.body.toAcno, req.body.amount).then((result) => {
        res.status(result.statusCode).json(result)
        console.log(result)
    })

})

server.get('/transaction-history',jwtMiddleware,(req,res)=>{

    console.log("inside transaction history")
    logic.transactionHistory(req.currentAcno).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

server.delete('/delete-account' , jwtMiddleware , (req,res)=>{
    console.log('inside deletion')
    logic.deleteAccount(req.currentAcno).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})
