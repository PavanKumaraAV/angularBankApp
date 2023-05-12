// import model / collection from db.js
const db = require('./db')

//import json web token
const jwt = require('jsonwebtoken')

//defining logic to resolve register request
const register = (acno, username, password) => {

    //check acno is existing in user collection of bank data base
    return db.User.findOne({
        acno
    }).then((result) => {

        if (result) {


            return {
                statusCode: 401,
                message: 'User already exit'

            }

        }
        else {
            const newUser = new db.User({
                acno,
                username,
                password,
                balance: 1000,
                transaction: []
            })
            newUser.save()
            return {
                statusCode: 200,
                message: "Registered successfully"
            }
        }
    })
}

// defining logic to resolve login request 
const login = (acno, pswd) => {
    // to find acno and pswd is available in db
    return db.User.findOne({
        acno,
        password: pswd
    }).then((result) => {

        //user exist
        if (result) {
            //generate a token using the method sign
            token = jwt.sign({
                loginAcno: acno
            }, "supersecretkey123")
            return {
                statusCode: 200,
                message: "Login successfull...",
                //sending loggined user name to client
                currentUsername: result.username,
                // sending loggined account number to client
                accountNumber: acno,

                token
            }

        }
        else {
            return {
                statusCode: 404,
                message: "User doesn't exist"
            }
        }
    })
}

const getBalance = (acno) => {
    return db.User.findOne({
        acno
    }).then((result) => {

        return {
            statusCode: 200,
            balance: result.balance
        }
    })
}

// fund transfer

const fundTransfer = (fromAcno, pswd, toAcno, amt) => {

    console.log(toAcno)
    let amount = parseInt(amt)
    return db.User.findOne({
        acno: fromAcno,
        password: pswd
    }).then(
        (result) => {
            // denied operation for self account transfer
            if (fromAcno === toAcno) {
                return {
                    statusCode: 404,
                    message: "fund transfer denied"
                }
            }
            if (result) {
                return db.User.findOne({
                    acno: toAcno
                }).then(
                    (data) => {
                        if (data) {
                            if (result.balance >= amount) {
                                result.balance -= amount;
                                data.balance += amount;
                                result.transaction.push({
                                    type: "Debit",
                                    fromAcno,
                                    toAcno,
                                    amount
                                })
                                result.save()
                                data.transaction.push({
                                    type: "Credit",
                                    fromAcno,
                                    toAcno,
                                    amount
                                })
                                data.save()
                                return {
                                    statusCode: 200,
                                    message: "Fund is transfering..."
                                }
                            }
                            else {
                                return {
                                    statusCode: 401,
                                    message: "Insufficient Balance"
                                }
                            }
                        }
                        else {
                            return {
                                statusCode: 401,
                                message: "invalid credit credential"
                            }
                        }
                    }
                )
            }
            else {
                return {
                    statusCode: 401,
                    message: "invalid debit credential"
                }
            }
        }
    )
}

// transaction history

const transactionHistory = (acno) => {
    return db.User.findOne({
        acno
    }).then((result) => {
        if (result) {
            return {
                statusCode: 200,
                transactions: result.transaction
            }
        }
        else {
            return {
                statusCode: 401,
                message: "Transaction History NOT found"
            }
        }
    })
}

const deleteAccount = (acno) => {

    return db.User.deleteOne({
        acno
    }).then((result) => {
        if (result) {
            return {
                statusCode: 200,
                message: "Account deleted successfully"
            }
        }
        else {
            return {
                statusCode: 401,
                message: "Unable to perform deletion"
            }
        }
    })
}


module.exports = {
    register,
    login,
    getBalance,
    fundTransfer,
    transactionHistory,
    deleteAccount
}