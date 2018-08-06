import express from 'express';
import raven from 'raven';
import morgan from 'morgan';
import path from 'path';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import multer from 'multer';
import fs from 'fs';

// Routers
import userRouter from './routes/user';
import boxRouter from './routes/box';
import itemRouter from './routes/item';

// Credentials
import imgurCreds from './imgurAPITokens.json';

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
const upload = multer({ dest: './upload/' });
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

// For React Frontend
app.get('/', (request, response) => {
    response.sendFile(__dirname + '/public/index.html');    // For React
});

// // Control origin of API Call
// app.use((req, res, next) => {
//     const allowedOrigins = ['http://localhost:8081', 'https://packit.caozimin.com'];
//     const origin = req.headers.origin;
//     if (allowedOrigins.indexOf(origin) >= 0) {
//         res.header('Access-Control-Allow-Origin', origin);
//     }
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     res.header('Access-Control-Allow-Credentials', true);
//     next();
// });

// Routes
app.use('/api/user', userRouter);
app.use(auth);                      // Everything now on requires auth
app.use('/api/box', boxRouter);
app.use('/api/item', itemRouter);
app.post('/api/image', upload.single('image'), (req, res) => {
    const image = req.file;
    if (image === undefined) return res.status(400).json({ error: true, message: 'No image specified' });

    const bitmap = fs.readFileSync(image.path);
    const imageBase64 = new Buffer(bitmap).toString('base64');
    axios.post('https://api.imgur.com/3/image',
        { image: imageBase64, type: 'base64' },
        { headers: { Authorization: 'Bearer ' + imgurCreds.accessToken }}
    ).then((resp) => {
        const url = resp.data.data.link;
        fs.unlinkSync(image.path);
        res.json({ error: false, imageURL: url });
    }).catch((err) => {
        console.log(JSON.stringify(err.response.data));
        fs.unlinkSync(image.path);
        res.status(500).json({ error: true, message: 'Check log for error detail' });
    });
});


// Error Handler
app.use(raven.errorHandler());

// Server setup
const port = process.env.PORT || 8080;
app.listen(port, (error) => {
    error
        ? console.log('ERROR:', error)
        : console.log(`🌎 Server listening at port ${port}. Visit http://localhost:${port}/`);
});
