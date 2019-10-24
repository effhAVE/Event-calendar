require("express-async-errors");
const express = require("express");
const app = express();
require("./startup/database")();
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/production")(app);

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => console.log(`Server running on port ${port}.`));
}

module.exports = app;