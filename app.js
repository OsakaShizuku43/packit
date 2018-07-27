import express from 'express';
import raven from 'raven';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

// Routers
import userRouter from './routes/user';

// MongoDB connection
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
// Auth middleware
const auth = (req, res, next) => {
    const authToken = req.headers.authorization;
    
    // No token present
    if (typeof authToken === 'undefined') {
        res.sendStatus(401);
        return;
    }

    // Verify token
    let userInfo;
    try {
        userInfo = jwt.verify(authToken, process.env.JWT_SECRET);
    } catch(err) {
        res.sendStatus(401);
        return;
    }

    // Check if user info exists
    if (typeof userInfo.username === 'undefined') {
        res.sendStatus(401);
        return;
    }

    req.user = userInfo;
    next();
};

// Routes
app.use('/api/user', userRouter);
app.use(auth);                      // Everything now on requires auth



// Error Handler
app.use(raven.errorHandler());
app.use((err, req, res, next) => {
    res.statusCode = 500;
    res.end(res.sentry + '\n');
});

// Server setup
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('Server listening at port ' + port);
});
