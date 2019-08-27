const express = require("express");
const router = express.Router();

router.post('/register', (req, res, next) => {
    res.json({msg: "User registered"});
})

router.post('/login', (req, res, next) => {
    res.json({msg: "user logged in"})
})

module.exports = router;