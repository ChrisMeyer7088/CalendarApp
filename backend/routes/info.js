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
                    return getUserNotices(result.rows[0].userId)
                } else {
                    res.status(200).json({
                        type: "user.authenticate",
                        data: {
                            message: "Token has expired",
                            returnToLogin: true
                        },
                        success: true
                    })
                }
            })
            .then(result => {
                if(result) {
                    res.status(200).json({
                        type: "user.authenticate",
                        data: {
                            message: "Authentication Successful",
                            returnToLogin: false,
                            notices: result.rows
                        },
                        success: true
                    })
                }
            })
            .catch(err => console.error(err))
    }
})


module.exports = router;