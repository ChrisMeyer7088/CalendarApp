const express = require("express");
const router = express.Router();
const { createNewUser, checkUsername } = require('../db/models/users')

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
    checkUsername(req.body.username)
        .then(result => {
            console.log(result)
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
    res.json({msg: "user logged in"})
})

module.exports = router;