const { port } = require('./config');
const express = require("express");
const app = express();
const appPort = port || "8000";
const userRoutes = require('./routes/user');
const infoRoutes = require('./routes/info');
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

app.use('/user', userRoutes)
app.use('/info', infoRoutes)

app.listen(appPort, () => {
    console.log("application started on port " + port);
})

module.exports = app;