const { getAssociatedUser } = require('../db/models/token');

function authenticateToken(req, res, next) {
    let token = req.header('Authorization')
    if(!token) {
        res.status(400).json({
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
                    next();
                } else {
                    res.status(200).json({
                        type: "info.authenticate",
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
                    type: "info.authenticate",
                    data: {
                        message: "Something went wrong"
                    },
                    success: false
                })
            })
    }
}

module.exports = {
    authenticateToken
}