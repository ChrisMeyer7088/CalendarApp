const express = require("express");
const router = express.Router();
const { createNewUser, getUser, checkUserCredentials } = require('../db/models/users')

router.post('/register', (req, res, next) => {
    if(!req.body.username || !req.body.password) {
        res.status(400).json({
            type: "registration.register",
            data: {
                message: "Invalid Request"
            },
            success: true
        })
    }
    createNewUser(req.body.username, req.body.password)
    .then(() => res.status(200).json({
        type: "registration.register",
        data: {
            message: "User successfully registered"
        },
        success: true
    }))
    .catch(err => {
        console.error(err.stack);
        res.status(500).json({
            type: "registration.register",
            data: {
                message: "Registeration attempt failed"
            },
            success: false
        })
    })
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
    }
    getUser(req.body.username)
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
            res.status(500).json({
                type: "user.username",
                data: {
                    message: "Something went wrong",
                    userExists: null
                },
                success: false
            })
        })

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
    }
    checkUserCredentials(req.body.username, req.body.password)
        .then(result => {
            if(result) {
                res.status(200).json({
                    type: "user.login",
                    data: {
                        message: "Credentials matched",
                        loggedIn: true
                    },
                    success: true
                })
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
        .catch(err => {
            res.status(500).json({
                type: "user.login",
                data: {
                    message: "Something went wrong",
                },
                success: false
            })
        })
})

module.exports = router;