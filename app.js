import express from 'express';
import raven from 'raven';
import morgan from 'morgan';
import path from 'path';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Routers
import userRouter from './routes/user';
import boxRouter from './routes/box';
import itemRouter from './routes/item';

// MongoDB connection
if (process.env.MONGODB_URI === undefined) {
    console.error('No MONGODB_URI found. Did you source env.sh?');
    process.exit(1);
}
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, () => {
    console.log('Connected to MongoDB');
});

// Express setup
const app = express();
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));        // Required for frontend
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Sentry.io setup
raven.config(process.env.SENTRY_DSN).install();
app.use(raven.requestHandler());

// Authentication Middleware
const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // No token present
    if (typeof authHeader === 'undefined') {
        res.sendStatus(401);
        return;
    }

    const authArray = authHeader.split(' ');
    if (authArray[0] !== 'Bearer' || authArray[1] === undefined) {
        res.sendStatus(401);
        return;
    }
    const authToken = authArray[1];

    // Verify token
    let userInfo;
    try {
        userInfo = jwt.verify(authToken, process.env.JWT_SECRET);
    } catch(err) {
        res.sendStatus(401);
        return;
    }

    // Check if user info exists
    if (typeof userInfo.userId === 'undefined') {
        res.sendStatus(401);
        return;
    }

    req.user = userInfo;
    next();
};

// Routes
app.get('/', (request, response) => {
    response.sendFile(__dirname + '/public/index.html');    // For React
});
app.use('/api/user', userRouter);
app.use(auth);                      // Everything now on requires auth
app.use('/api/box', boxRouter);
app.use('/api/item', itemRouter);


// Error Handler
app.use(raven.errorHandler());

// Server setup
const port = process.env.PORT || 8080;
app.listen(port, (error) => {
    error
        ? console.log('ERROR:', error)
        : console.log('🌎 Server listening at port ' + port);
});
