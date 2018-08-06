import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

// Models
import User from '../models/User';

// Middleware function
router.use((req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username === undefined || password === undefined || typeof username !== 'string' || typeof password !== 'string') {
        res.status(400).json({ error: true });
        return;
    }
    next();
});

// Routes without authentication needed
router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    let userId;
    User.findOne({ username }).exec()
        .then((user) => {
            if (user === null) {
                res.status(401).json({ error: true, message: 'Invalid credential' });
                throw new Error('STOP');
            }
            userId = user._id;
            return bcrypt.compare(password, user.password);
        })
        .then((result) => {
            if (!result) {
                res.status(401).json({ error: true, message: 'Invalid credential' });
                throw new Error('STOP');
            }
            return jwt.sign({ userId, username }, process.env.JWT_SECRET, { expiresIn: '1d' });
        })
        .then((token) => {
            res.json({ error: false, token: token });
        })
        .catch((err) => {
            if (err.message === 'STOP') return;
            throw err;
        });
});

router.post('/register', (req, res) => {
    if (req.body.invitation !== process.env.INVITATION) return res.sendStatus(400);
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
        .then(() => {
            res.json({ error: false });
        })
        .catch((err) => {
            if (err.message === 'STOP') {
                return;
            }
            res.status(500).json({
                error: true
            });
            throw err;
        });
});

// Fall through to default response for everything else
// router.all('*', (req, res, next) => next());


export default router;