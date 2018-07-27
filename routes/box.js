import express from 'express';
const router = express.Router();

// Models
import Box from '../models/Box';

// Routes
// Get all boxes of the current user
router.get('/', (req, res) => {
    const userId = req.user.userId;
    Box.find({ belongsTo: userId }).exec()
    .then((boxes) => {
        res.json({ error: false, boxes: boxes });
    })
    .catch((err) => {
        throw err;
    })
});

// Create a new box
router.post('/', (req, res) => {
    const userId = req.user.userId;
    if (req.body.name === undefined) {
        res.status(400).json({ error: true, message: "New box requires a name" });
        return;
    }
    const newBox = new Box({
        belongsTo: userId,
        name: req.body.name,
        imageURL: req.body.imageURL,
        items: []
    });
    newBox.save()
    .then((result) => {
        res.json({ error: false, boxId: result._id });
    })
    .catch((err) => {
        throw err
    });
})

// Get all information of a box
router.get('/:boxId', (req, res) => {
    res.send(req.params.boxId);
});

// Get all items in a box
router.get('/:boxId/items', (req, res) => {
    res.send('All items in box ' + req.params.boxId);
})

export default router;
