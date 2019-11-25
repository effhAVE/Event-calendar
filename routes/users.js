const {
    User,
    validate
} = require("../models/user");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const events = require("./events");
const settings = require("./settings");

router.use("/:userId/events", events);
router.use("/me/settings", settings);

router.get("/me", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -events");
    res.send(user);
});

router.put("/me", auth, async (req, res) => {
    if (!req.body.name || req.body.name.length < 5) {
        return res.status(400).send("Invalid request.");
    }

    const user = await User.findById(req.user._id);
    user.name = req.body.name;

    const result = await user.save();
    res.send(result);
});

router.post("/", async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({
        email: req.body.email
    });
    if (user) {
        return res.status(400).send("User already registered.");
    }

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const token = user.generateAuthToken();
    
    res.header("x-auth-token", token).send({
        _id: user._id,
        name: user.name,
        email: user.email
    });
});

module.exports = router;