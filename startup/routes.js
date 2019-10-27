const express = require("express");
const users = require("../routes/users");
const auth = require("../routes/auth");
const history = require("connect-history-api-fallback");
const error = require("../middleware/error");

module.exports = function(app) {
    app.use(express.json());
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
        res.header('Access-Control-Expose-Headers', "x-auth-token");
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        next();
    });
    app.use("/api/users", users);
    app.use("/api/auth", auth);
    app.use(history());
    app.use(error);
}