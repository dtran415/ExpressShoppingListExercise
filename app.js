const express = require("express");
const ExpressError = require('./expressError')
const routes = require("./routes")

const app = express();

app.use(express.json());
app.use("/items", routes);

// should end up here if route not found
app.use((req, res, next) => {
    throw new ExpressError("Page not found", 404);
});

// error handler
app.use(function (err, req, res, next) {
    // the default status is 500 Internal Server Error
    let status = err.status || 500;
    let message = err.message;

    // set the status and alert the user
    return res.status(status).json({
        error: { message, status }
    });
});

module.exports = app;