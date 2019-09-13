const express = require("express");
const router = express.Router();
const { getUserNotices } = require('../db/models/notices');
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

router.post("notice", authenticateToken, (req, res, next) => {
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