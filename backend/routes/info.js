const express = require("express");
const router = express.Router();
const { getUserNotices } = require('../db/models/notices');
const { getUserById } = require('../db/models/users');
const { authenticateToken } = require('../services/infoServices')

router.get("/notices", authenticateToken, (req, res, next) => {
    getUserNotices(req.body.userId)
        .then(result => {
            if(!result) return;
            res.status(200).json({
                type: "info.notices",
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
                type: "info.notices",
                data: {
                    message: "Something went wrong"
                },
                success: false
            })
        })
})

router.get('/account', authenticateToken, (req, res, next) => {
    getUserById(req.body.userId)
        .then(result => {
            if(!result) return;
            let info = result.rows[0];
            res.status(200).json({
                type: "info.user",
                data: {
                    message: "Account Info Retrieved",
                    returnToLogin: false,
                    email: info.email,
                    username: info.username
                },
                success: true
            })
        })
        .catch(err => {
            res.status(500).json({
                type: "info.user",
                data: {
                    message: "Something went wrong",
                    returnToLogin: false
                },
                success: false
            })
        })
})

router.delete("/account", authenticateToken, (req, res, next) => {
    res.status(200).json({
        type: "info.Accountdelete",
            data: {
                message: "Account deleted"
            },
            success: true
    })
})

router.post("/notice", authenticateToken, (req, res, next) => {
    let notice = req.body.notice;
    if(!notice || !notice.title || !notice.beginDate || !notice.endDate || !notice.color || !notice.userId) {
        res.status(400).json({
            type: "info.addnotice",
            data: {
                message: "Invalid notice"
            },
            success: false
        })
    } else {
        console.log('Adding valid notice')
    }
})

module.exports = router;