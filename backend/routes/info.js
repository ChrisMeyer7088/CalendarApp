const express = require("express");
const router = express.Router();
const { getUserNotices, addNotice } = require('../db/models/notices');
const { getUserById, deleteUserById } = require('../db/models/users');
const { authenticateToken, validateNotice } = require('../services/info')

router.get("/notices", authenticateToken, (req, res, next) => {
    let date = new Date(req.query.date);
    if(!date) {
        res.status(400).json({
            type: "info.notices",
                data: {
                    message: "Date is a required Query Parameter",
                },
                success: false
        })
    } else {
        getUserNotices(req.body.userId, date)
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
    }
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
    deleteUserById(req.body.userId)
    .then(result => {
        res.status(200).json({
            type: "info.AccountDelete",
                data: {
                    message: "Account deleted"
                },
                success: true
        })
    })
    .catch(err => {
        res.status(500).json({
            type: "info.AccountDelete",
                data: {
                    message: "Something went wrong"
                },
                success: false
        })
    })
    
})

router.post("/notice", [authenticateToken, validateNotice], (req, res, next) => {
    let notice = req.body.notice;
    addNotice(notice.title, notice.beginDate, notice.endDate, notice.color, req.body.userId, notice.description || '')
        .then(queryResult => {
            res.status(200).json({
                type: "info.addnotice",
                data: {
                    message: "Notice Added"
                },
                success: true
            })
        })
        .catch(err => {
            res.status(500).json({
                type: "info.addnotice",
                    data: {
                        message: "Something went wrong"
                    },
                    success: false
            })
        })
})

module.exports = router;