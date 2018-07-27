import express from 'express';
import raven from 'raven';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Routers
import userRouter from './routes/user';
import boxRouter from './routes/box';

// MongoDB connection
if (process.env.MONGODB_URI === undefined) {
    throw Error('No MONGODB_URI found. Did you source env.sh?');
}
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, () => {
    console.log('Connected to MongoDB');
});

// Express setup
const app = express();
app.use(morgan('combined'));
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
app.use('/api/user', userRouter);
app.use(auth);                      // Everything now on requires auth
app.use('/api/box', boxRouter);


// Error Handler
app.use(raven.errorHandler());
app.use((err, req, res, next) => {
    res.status(500).json({
        error: true,
        message: res.sentry + '\n'
    });
});

// Server setup
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('Server listening at port ' + port);
});
