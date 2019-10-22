const {
    Event,
    validate
} = require("../models/event");
const {
    User
} = require("../models/user");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router({
    mergeParams: true
});
const mongoose = require("mongoose");
const validateObjectID = require("../middleware/validateObjectID");

router.get("/", validateObjectID("userId"), auth, async (req, res) => {
    let userId = req.params.userId;
    const date = new Date();
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).send("User with the given ID was not found.");
    }

    let events = await User.aggregate([{
            $match: {
                "_id": mongoose.Types.ObjectId(userId)
            }
        }, {
            $project: {
                events: {
                    $filter: {
                        input: "$events",
                        as: "event",
                        cond: {
                            $and: [{
                                    $gte: ["$$event.startDate", startDate]
                                },
                                {
                                    $lte: ["$$event.startDate", endDate]
                                }
                            ]
                        }
                    }
                }
            }
        }

    ]);
    
    events = events[0].events;
    res.send(events);
});

router.post("/", validateObjectID("userId"), auth, async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).send("User with the given ID was not found.");
    }

    const event = new Event({
        name: req.body.name,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        color: req.body.color,
        details: req.body.details
    });

    user.events.push(event);
    await user.save();
    res.send(event);
});

router.get("/:eventId", validateObjectID("userId", "eventId"), auth, async (req, res) => {
    let userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).send("User with the given ID was not found.");
    }

    const eventId = req.params.eventId;
    const event = user.events.id(eventId);
    if (!event) {
        return res.status(404).send("Event not found");
    }

    res.send(event);
});

router.delete("/:eventId", validateObjectID("userId", "eventId"), auth, async (req, res) => {
    let userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).send("User with the given ID was not found.");
    }

    const eventId = req.params.eventId;
    const event = user.events.id(eventId);
    if (!event) {
        return res.status(404).send("Event not found");
    }

    await event.remove();
    await user.save();
    res.send(event);
});

router.put("/:eventId", validateObjectID("userId", "eventId"), auth, async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).send("User with the given ID was not found.");
    }

    const eventId = req.params.eventId;
    const event = user.events.id(eventId);
    if (!event) {
        return res.status(404).send("Event not found");
    }

    event.set({
        name: req.body.name,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        color: req.body.color,
        details: req.body.details
    });

    await user.save();
    res.send(event);
});

module.exports = router;