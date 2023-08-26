//set up the express, helmet, cors, bodyparser, morgan for the api by impoeting as the first step
require('dotenv').config()
const express = require('express');
const app = express();
//import bodyparser;
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');


//create port and in order to be on a safe side we hardcode the port to be from our environment or the port number
const port = process.env.PORT || 3001

//API Security;
app.use(helmet());

//handle Cors error;
app.use(cors());

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Load routers
const userRouter = require('./src/routers/user.router');
const ticketRouter = require('./src/routers/ticket.router');
const tokensRouter = require('./src/routers/tokens.router');


//Use Routers
app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);
app.use("/v1/tokens", tokensRouter);

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

