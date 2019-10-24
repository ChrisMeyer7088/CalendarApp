const { getAssociatedUser, updateToken } = require('../db/models/token');

function authenticateToken(req, res, next) {
    let token = req.header('Authorization')
    if(!token) {
        res.status(401).json({
            type: "info.authenticate",
            data: {
                message: "Request must have a valid token"
            },
            success: false
        })
    } else {
        getAssociatedUser(token)
            .then(result => {
                if(result.rowCount) {
                    req.body.userId = result.rows[0].userid
                    return updateToken(token)
                } else {
                    res.status(401).json({
                        type: "info.authenticate",
                        data: {
                            message: "Invalid Token",
                            returnToLogin: true
                        },
                        success: true
                    })
                }
            })
            .then(queryResult => {
                if(queryResult) {
                    next();
                }
            })
            .catch(err => {
                res.status(500).json({
                    type: "info.authenticate",
                    data: {
                        message: "Something went wrong"
                    },
                    success: false
                })
            })
    }
}

function validateNotice(req, res, next) {
    let notice = req.body.notice;
    let {title, beginDate, endDate, color} = notice;
    beginDate = new Date(beginDate);
    endDate = new Date(endDate);
    color = color.substring(1, color.length)
    if(!notice || !title || !datesAreVaid(beginDate, endDate) || !colorIsValid(color)) {
        
        res.status(400).json({
            type: "info.notice",
            data: {
                message: "Invalid Notice",
                returnToLogin: true
            },
            success: true
        })
    } else {
        req.body.notice.beginDate = beginDate;
        req.body.notice.endDate = endDate;
        req.body.notice.color = color;
        next();
    }
}

//Color: aa33ff
function colorIsValid(color) {
    let re = /[0-9A-Fa-f]{6}/g;
    if(re.test(color) && color.length === 6)
        return true;
    return false;
}

function datesAreVaid(beginDate, endDate) {
    if(beginDate && endDate && typeof beginDate.getTime === 'function' && typeof endDate.getTime === 'function' && 
    beginDate.getTime() < endDate.getTime())
        return true;
    return false;
}

module.exports = {
    authenticateToken,
    validateNotice
}