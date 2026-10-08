//set up the express, helmet, cors, bodyparser, morgan for the api by impoeting as the first step
require('dotenv').config()
const express = require('express');
const app = express();
//import bodyparser;
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
// const fileUpload = require("express-fileupload");


//create port and in order to be on a safe side we hardcode the port to be from our environment or the port number
const port = process.env.PORT || 3001

//API Security; allow images to be embedded by the frontend on another origin
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

//handle Cors error; restrict to configured client origins in production,
// allow all when CLIENT_ORIGIN is not set (local dev).
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
app.use(
    cors(
        allowedOrigins.length
            ? {
                  origin: (origin, cb) =>
                      !origin || allowedOrigins.includes(origin)
                          ? cb(null, true)
                          : cb(new Error("Not allowed by CORS")),
              }
            : undefined
    )
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(fileUpload());

//MongoDB connection Setup
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);

if (process.env.NODE_ENV !== 'production') {
    const mDb = mongoose.connection
    mDb.on("open", () => {
        console.log("MongoDB is connected")
    })

    mDb.on("error", (error) => {
        console.log(error)
    })

    //Logger;
    app.use(morgan('tiny'));
}

//set BodyParser;
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// Health check for deploy platforms (Render/Railway/uptime monitors).
app.get("/health", (req, res) =>
    res.json({ status: "ok", uptime: process.uptime() })
);

// Serve uploaded media (ticket photos, package photos).
app.use("/uploads", express.static("uploads"));

//Load routers
const userRouter = require('./src/routers/user.router');
const ticketRouter = require('./src/routers/ticket.router');
const tokensRouter = require('./src/routers/tokens.router');
const notificationRouter = require('./src/routers/notification.router');
const packageRouter = require('./src/routers/package.router');

//Use Routers
app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);
app.use("/v1/tokens", tokensRouter);
app.use("/v1/notification", notificationRouter);
app.use("/v1/package", packageRouter);

// Error Handler
const handleError = require('./src/utils/errorHandler');
//adding the middleware; middleware is the help to us to access the request or response and modify them;
app.use('*', (req, res, next) => { // req, res, next are properties we get from router
    const error = new Error("Resources are not found!")
    error.status = 404;
    //next handles any call router that is defined below;
    next(error)
});

app.use((error, req, res, next) => {
    handleError(error, res);
})

//nodemon package npm is the one that helps to reload the server everytime to save the file
app.listen(port, () => {
    console.log(`API is ready on http://localhost:${port}`)
})

//----------to Connect to mongo database-----------//
// 1. to restart brew and mongo ---- brew services start or restart mongodb/brew/mongodb-community ---
// 2. ---sudo mongod --dbpath /System/Volumes/data/data/db---  or 
// 3. create an alias - -----alias mongod='sudo mongod --dbpath /System/Volumes/Data/data/db'----
// then nodemon

// 4. run mongod
// 5. Run the Postman to make calls to database
// 6. run the npm start or nodemon to start the app

