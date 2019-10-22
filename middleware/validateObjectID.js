const mongoose = require("mongoose");

module.exports = function(...id) {
    return function(req, res, next) {
        id.forEach(i => {
            if(!mongoose.Types.ObjectId.isValid(req.params[i])) {
                return res.status(404).send("Invalid ID.");
            }
        });

        next();
    }
}