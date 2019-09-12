const express = require("express");
const router = express.Router();
const { getUserNotices } = require('../db/models/notices');
const { getAssociatedUser } = require('../db/models/token');

router.post('/auth', (req, res, next) => {
    if(!req.body.token) {
        res.status(400).json({
            type: "user.authenticate",
            data: {
                message: "Invalid request"
            },
            success: false
        })
    } else {
        getAssociatedUser(req.body.token)
            .then(result => {
                if(result.rowCount) {
                    res.status(200).json({
                        type: "user.authenticate",
                        data: {
                            message: "Authentication Successful",
                            returnToLogin: false,
                            userId: result.rows[0].userid
                        },
                        success: true
                    })
                } else {
                    res.status(200).json({
                        type: "user.authenticate",
                        data: {
                            message: "Invalid Token",
                            returnToLogin: true
                        },
                        success: true
                    })
                }
            })
            .catch(err => {
                res.status(500).json({
                    type: "user.authenticate",
                    data: {
                        message: "Something went wrong"
                    },
                    success: false
                })
            })
    }
})

router.post("/notices", (req, res, next) => {
    if(!req.body.token || !req.body.userId) {
        res.status(400).json({
            type: "user.notices",
            data: {
                message: "Invalid request"
            },
            success: false
        })
    } else {
        getAssociatedUser(req.body.token)
            .then(result => {
                if(result.rowCount) {
                    return getUserNotices(req.body.userId)
                } else {
                    res.status(200).json({
                        type: "user.notices",
                        data: {
                            message: "Invalid Token",
                            returnToLogin: true
                        },
                        success: true
                    })
                }
            })
            .then(result => {
                if(!result) return;
                res.status(200).json({
                    type: "user.notices",
                    data: {
                        message: "Notices Retrieved",
                        returnToLogin: false,
                        notices: result.rows
                    },
                    success: true
                })
            })
            .catch(err => {
                res.status(500).json({
                    type: "user.notices",
                    data: {
                        message: "Something went wrong"
                    },
                    success: false
                })
            })
    }
})

module.exports = router;