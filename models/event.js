const Joi = require("joi");
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'Unnamed event',
        minlength: 4,
        maxlength: 255
    },
    
    startDate: {
        type: Date,
        required: true
    },
    
    endDate: {
        type: Date,
        required: true
    },
    
    color: {
        type: String,
        default: "#ff0000"
    },

    details: {
        type: String,
        default: ""
    }
});

function validateEvent(event) {
    const schema = {
        name: Joi.string().min(4).max(255),
        startDate: Joi.date().required(),
        endDate: Joi.date().required().min(Joi.ref("startDate")),
        color: Joi.string(),
        details: Joi.string()
    };

    return Joi.validate(event, schema);
}

const Event = mongoose.model("Event", eventSchema);

exports.Event = Event;
exports.validate = validateEvent;