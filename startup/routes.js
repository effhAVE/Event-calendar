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
        next();
    });
    app.use("/api/users", users);
    app.use("/api/auth", auth);
    app.use("/", express.static("../client/dist"));
    app.use(history());
    app.use(error);
}