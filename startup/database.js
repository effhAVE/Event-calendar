const mongoose = require("mongoose");
const config = require("config");

module.exports = function() {
    const db = config.get("db");
    mongoose.set('useUnifiedTopology', true);
    mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true
        })
        .then(() => console.log(`Connected to ${db}`))
        .catch(err => console.error(`Coult not connect to ${db}, ${err}`));
}