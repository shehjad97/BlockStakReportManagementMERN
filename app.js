require("dotenv").config();

const express = require("express");
const morgan = require("./config/morgan");
const helmet = require("helmet");
const cookieParser = require('cookie-parser');
const cors = require("./config/cors");
const expressRateLimit = require("./config/express-rate-limit");
const expressSlowDown = require("./config/express-slow-down");
const { swaggerServe, swaggerSetup } = require("./config/swagger");
const xssClean = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");

const app = express();

let bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true, parameterLimit: 50000 }));

const routes = require("./routes");
require("./config/mongoose"); // connect mongoose

app.use("/api-docs", swaggerServe, swaggerSetup); // swagger api documentations
app.use(morgan); // HTTP request logger
app.use(helmet()); // set security HTTP headers
app.use(express.json()); // parse json request body
app.use(cookieParser()); // parse cookies
app.use(xssClean()); // sanitize request data
app.use(mongoSanitize()); // sanitize mongoose data
app.use(compression()); // gzip compression
app.use(cors); // enable cors
// only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)
app.enable("trust proxy");

if (process.env.NODE_ENVIRONMENT === "production") {
    app.use(expressRateLimit); // per window rate limit
    app.use(expressSlowDown);  // slows down responses rather than blocking
}

app.use(routes); // routes

module.exports = app;
