const express = require("express");
const router = express.Router();
const { createNewUser, getUserByUsername, checkUserCredentials, getUserByEmail } = require('../db/models/users')
const { createToken, checkForActiveToken } = require('../db/models/token');
const { validatePassword, validateEmail } = require('../services/userServices')

router.post('/register', (req, res, next) => {
    if(!req.body.username || !req.body.password || !req.body.email) {
        res.status(400).json({
            type: "registration.register",
            data: {
                message: "Invalid Request"
            },
            success: true
        })
    } if(!validatePassword(req.body.password)) {
        res.status(400).json({
            type: "registration.register",
            data: {
                message: "Invalid Password"
            },
            success: true
        })
    } else if(!validateEmail(req.body.email)) {
        res.status(400).json({
            type: "registration.register",
            data: {
                message: "Invalid Email"
            },
            success: true
        })
    } else {
        getUserByUsername(req.body.username)
        .then(result => {
            if(result.rowCount === 0) {
                return createNewUser(req.body.username, req.body.password, req.body.email)
            } else {
                res.status(400).json({
                    type: "registration.register",
                    data: {
                        message: "Invalid Username"
                    },
                    success: true
                })
            }
        })
        .then(result => {
            if(!result) return;
            res.status(200).json({
                type: "registration.register",
                data: {
                    message: "User successfully registered"
                },
                success: true
            })
        })
        .catch(err => {
            console.error(err.stack);
            res.status(500).json({
                type: "registration.register",
                data: {
                    message: "Registration attempt failed"
                },
                success: false
            })
        })
    }
})

router.post('/email', (req, res, next) => {
    if(!req.body.email) {
        res.status(400).json({
            type: "user.email",
            data: {
                message: "Invalid request sent",
                userExists: null
            },
            success: false
        })
    } else {
        getUserByEmail(req.body.email)
        .then(result => {
            if(result.rowCount === 0){
                res.status(200).json({
                    type: "user.email",
                    data: {
                        message: "Request successful",
                        userExists: false
                    },
                    success: true
                })
            } else {
                res.status(200).json({
                    type: "user.email",
                    data: {
                        message: "Request successful",
                        userExists: true
                    },
                    success: true
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                type: "user.username",
                data: {
                    message: "Something went wrong",
                    userExists: null
                },
                success: false
            })
        })

    }
})

router.post('/user', (req, res, next) => {
    if(!req.body.username) {
        res.status(400).json({
            type: "user.username",
            data: {
                message: "Invalid request sent",
                userExists: null
            },
            success: false
        })
    } else {
        getUserByUsername(req.body.username)
        .then(result => {
            if(result.rowCount === 0){
                res.status(200).json({
                    type: "user.username",
                    data: {
                        message: "Request successful",
                        userExists: false
                    },
                    success: true
                })
            } else {
                res.status(200).json({
                    type: "user.username",
                    data: {
                        message: "Request successful",
                        userExists: true
                    },
                    success: true
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                type: "user.username",
                data: {
                    message: "Something went wrong",
                    userExists: null
                },
                success: false
            })
        })

    }
})

router.post('/login', (req, res, next) => {
    if(!req.body.username || !req.body.password) {
        res.status(400).json({
            type: "user.login",
            data: {
                message: "Invalid request",
            },
            success: false
        })
    } else {
        let userId = ''
        //Retrieves The User entry if credentials are valid
        checkUserCredentials(req.body.username, req.body.password)
            .then(fetchedUserId => {
                if(fetchedUserId) {
                    userId = fetchedUserId
                    return checkForActiveToken(fetchedUserId)
                } else {
                    res.status(200).json({
                        type: "user.login",
                        data: {
                            message: "Invalid credentials",
                            loggedIn: false
                        },
                        success: true
                    })
                }
            })
            .then(resultQuery => {
                if(!resultQuery) return;
                //If no active tokens are found generate a token otherwise return the first active token
                if(resultQuery.rowCount === 0) {
                    return createToken(userId)
                } else {
                    res.status(200).json({
                        type: "user.login",
                        data: {
                            message: "Token Found",
                            loggedIn: true,
                            token: resultQuery.rows[0].value
                        },
                        success: true
                    })
                }
            })
            .then(newTokenValue => {
                if(!newTokenValue) return;
                res.status(200).json({
                    type: "user.login",
                    data: {
                        message: "Credentials matched, token created",
                        loggedIn: true,
                        token: newTokenValue
                    },
                    success: true
                })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    type: "user.login",
                    data: {
                        message: "Something went wrong",
                    },
                    success: false
                })
            })
    }
})

module.exports = router;