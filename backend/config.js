const dotenv = require('dotenv');
const result = dotenv.config();
if(result.error) {
    throw result.error;
}

let environment = process.env.NODE_ENV;
console.log("Running application in " + environment);

if(environment === "production") {
    module.exports = {
        port : process.env.PROD_PORT,
        DBHost : process.env.PROD_DB_HOST,
        DBUser : process.env.PROD_DB_USER,
        DBPass : process.env.PROD_DB_PASS,
        DBName: process.env.PROD_DB_NAME
    }
} if(environment === "test") {
    module.exports = {
        port : process.env.TEST_PORT,
        DBHost : process.env.TEST_DB_HOST,
        DBUser : process.env.TEST_DB_USER,
        DBPass : process.env.TEST_DB_PASS,
        DBName: process.env.TEST_DB_NAME
    }
}else {
    module.exports = {
        port : process.env.DEV_PORT,
        DBHost : process.env.DEV_DB_HOST,
        DBUser : process.env.DEV_DB_USER,
        DBPass : process.env.DEV_DB_PASS,
        DBName: process.env.DEV_DB_NAME
    }
}