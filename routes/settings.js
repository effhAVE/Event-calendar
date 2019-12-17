const {
    User
} = require("../models/user");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
    const { settings } = await User.findById(req.user._id).select("settings");
    res.send(settings);
});

router.put("/lang", auth, async (req, res) => {
    const user = await User.findById(req.user._id);
    user.settings.lang = req.body.lang;
    const { settings } = await user.save();
    res.send(settings);
});

router.put("/layout", auth, async (req, res) => {
    const user = await User.findById(req.user._id);
    user.settings.layout = req.body;
    const { settings: { layout } } = await user.save();
    res.send(layout);
});

router.put("/calendar", auth, async (req, res) => {
    const user = await User.findById(req.user._id);
    user.settings.calendar = req.body;
    const { settings: { calendar } } = await user.save();
    res.send(calendar);
});

module.exports = router;