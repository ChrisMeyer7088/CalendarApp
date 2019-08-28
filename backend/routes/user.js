const express = require("express");
const router = express.Router();
const { createNewUser } = require('../db/models/users')

router.post('/register', (req, res, next) => {
    createNewUser(req.body.username, req.body.password)
    .then(() => res.status(200).json({
        type: "user.registration",
        data: {
            message: "User successfully registered"
        },
        success: true
    }))
    .catch(err => {
        console.error(err.stack);
        res.status(500).json({
            type: "user.registration",
            data: {
                message: "Registeration attempt failed"
            },
            success: false
        })
    })
})

router.post('/login', (req, res, next) => {
    res.json({msg: "user logged in"})
})

module.exports = router;