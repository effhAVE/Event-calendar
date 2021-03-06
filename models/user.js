const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const {
    Event
} = require("./event");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    events: [Event.schema],
    settings: {
        lang: {
            type: String,
            default: "en"
        },
        layout: {
            dark: {
                type: Boolean,
                default: false
            },
            theme: {
                type: String,
                default: "primary"
            }
        },
        calendar: {
            weekSchema: {
                type: Array,
                default: [0, 1, 2, 3, 4, 5, 6]
            }
        }
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({
        _id: this._id
    }, config.get("jwtPrivateKey"));
    return token;
}
const User = mongoose.model("User", userSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(25).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;