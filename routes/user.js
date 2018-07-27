import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

// Models
import User from '../models/User';

// Middleware function
const requireCredential = (req, res, next) => {
    if (req.body.username === undefined || req.body.password === undefined) {
        res.status(400).json({ error: true });
        return;
    }
    next();
}

// Routes without authentication needed
router.post('/login', requireCredential);
router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ username }).exec()
    .then((user) => {
        if (user === null) {
            res.status(401).json({ error: true, message: 'Invalid credential' });
            throw new Error('STOP');
        }
        return bcrypt.compare(password, user.password);
    })
    .then((result) => {
        if (!result) {
            res.status(401).json({ error: true, message: 'Invalid credential' });
            throw new Error('STOP');
        }
        return jwt.sign({ username: username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    })
    .then((token) => {
        res.json({ error: false, token: token });
    })
    .catch((err) => {
        if (err.message === 'STOP') return;
        throw err;
    });
});

router.post('/register', requireCredential);
router.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    User.findOne({ username }).exec()
    .then((user) => {
        if (user !== null) {
            res.status(400).json({
                error: true,
                message: 'Username already taken'
            });
            throw new Error('STOP');
        }
        const newUser = new User({
            username: username,
            password: hashedPassword
        });
        return newUser.save();
    })
    .then((user) => {
        res.json({ error: false });
    })
    .catch((err) => {
        if (err.message === 'STOP') {
            return;
        } else {
            res.status(500).json({
                error: true
            });
            throw err;
        }
    });
});

// Auth middleware
router.use((req, res, next) => {
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
    if (typeof userInfo.user === 'undefined') {
        res.sendStatus(401);
        return;
    }

    req.user = userInfo;
    next();
});

// User routes
router.get('/', (req, res) => {
    res.json(req.user);
})


export default router;