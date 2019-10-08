const express = require("express");
const router = express.Router();
const { getUserByEmail } = require('../db/models/users')
const { createResetLink, getActiveResetLink, checkLinkValue, resetPassword} = require('../db/models/resetLink');
const { sendMail, validatePassword } = require('../services/userServices')


router.post('/email', (req, res, next) => {
    if(!req.body || !req.body.email) {
        res.status(400).json({
            type: "password-reset.reset",
            data: {
                message: "The parameter email is required"
            },
            success: false
        })
    } else {
        let email = req.body.email;
        let userId = ''
        getUserByEmail(email)
            .then(result => {
                if(result.rowCount === 0) {
                    res.status(200).json({
                        type: "password.reset",
                        data: {
                            message: "Email does not exist",
                        },
                        success: true
                    })
                } else {
                    userId = result.rows[0].id;
                    return createResetLink(userId)
                }
            })
            .then(result => {
                if(!result) return;
                return getActiveResetLink(userId)
            })
            .then(result => {
                if(!result) return
                let value = result.rows[0].value;
                let subject = "Password Reset Link for My Private Calender";
                let body = `Click the following link to reset your password, link expires in 1 hour.
                    \nhttp://localhost:3000/password-reset?link-value=${value}
                    \nThanks for your continued support!
                    \n-My Scheduler Team
                `
                return sendMail(email, subject, body)
            })
            .then(result => {
                if(!result) return
                res.status(200).json({
                    type: "password.reset",
                    data: {
                        message: "Link Sent",
                    },
                    success: true
                })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    type: "password.reset",
                    data: {
                        message: "Something went wrong",
                    },
                    success: false
                })
            })
    }
})


//Verifies a link value sent to retireve information
router.post('/verify-link', (req, res, next) => {
    if(!req.body || !req.body.value) {
        res.status(400).json({
            type: "password-reset.verify",
            data: {
                message: "The parameter value is required"
            },
            success: false
        })
    } else {
        let linkValue = req.body.value;
        checkLinkValue(linkValue)
        .then(result => {
            if(result.rowCount === 1) {
                res.status(200).json({
                    type: "password.reset",
                    data: {
                        message: "Verification Successful",
                        email: result.rows[0].email
                    },
                    success: true
                })
            } else {
                res.status(400).json({
                    type: "password.reset",
                    data: {
                        message: "Bad Link Value",
                    },
                    success: false
                })
            }
            
        })
        .catch(err => {
            console.log(err)
                res.status(500).json({
                    type: "password.verify",
                    data: {
                        message: "Something went wrong",
                    },
                    success: false
                })
        })
    }
})

router.put('/password', (req, res, next) => {
    if(!req.body || !req.body.value || !req.body.password) {
        res.status(400).json({
            type: "password-reset.verify",
            data: {
                message: "The body parameter value or password is missing"
            },
            success: false
        })
    } else {
        let linkValue = req.body.value;
        let password = req.body.password;
        if(!validatePassword(password)) {
            res.status(400).send({
                type: "password.passwordUpdate",
                    data: {
                        message: "Invalid password submitted",
                    },
                    success: false
            })
        } else {
            checkLinkValue(linkValue)
            .then(result => {
                if(!result) return
                if(result.rowCount === 1)
                    return resetPassword(linkValue, password)
                else {
                    res.status(400).json({
                        type: "password.passwordUpdate",
                        data: {
                            message: "Invalid link value",
                        },
                        success: false
                    })
                }
            })
            .then(result => {
                if(!result) return
                if(result.rowCount === 1) {
                    res.status(200).json({
                        type: "password.passwordUpdate",
                        data: {
                            message: "Password successfully updated",
                        },
                        success: true
                    })
                } else {
                    res.status(400).json({
                        type: "password.passwordUpdate",
                        data: {
                            message: "Invalid link value",
                        },
                        success: false
                    })
                }
            })
            .catch(err => {
                console.log(err)
                    res.status(500).json({
                        type: "password.passwordUpdate",
                        data: {
                            message: "Something went wrong",
                        },
                        success: false
                    })
            })
        }
    }
})

module.exports = router