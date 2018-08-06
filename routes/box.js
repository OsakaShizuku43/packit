import express from 'express';
const router = express.Router();

// Models
import Box from '../models/Box';
import Item from '../models/Item';

// Routes
// Get all boxes of the current user
router.get('/', (req, res, next) => {
    const userId = req.user.userId;
    Box.find({ belongsTo: userId }).exec()
        .then((boxes) => {
            res.json({ error: false, boxes: boxes });
        })
        .catch((err) => next(err));
});

// Create a new box
router.post('/', (req, res, next) => {
    const userId = req.user.userId;
    if (req.body.name === undefined || req.body.name.trim() === '') {
        res.status(400).json({ error: true, message: 'New box requires a name' });
        return;
    }
    const newBox = new Box({
        belongsTo: userId,
        name: req.body.name,
        description: req.body.description,
        imageURL: req.body.imageURL
    });
    newBox.save()
        .then((result) => res.json({ error: false, boxId: result._id }))
        .catch((err) => next(err));
});

// Get all information of a box
router.get('/:boxId', (req, res, next) => {
    Box.findById(req.params.boxId)
        .exec()
        .then((box) => {
            if (box === null) {
                res.status(404).json({ error: true, message: 'Box not found' });
                throw new Error('STOP');
            }
            if (box.belongsTo.toString() !== req.user.userId) {
                res.status(403).json({ error: true, message: 'This box does not belong to you' });
                throw new Error('STOP');
            }
            res.json({ error: false, box: box });
        })
        .catch((err) => {
            if (err.message === 'STOP') return;
            next(err);
        });
});

// Modify information of a box
router.put('/:boxId', (req, res, next) => {
    Box.findById(req.params.boxId)
        .exec()
        .then((box) => {
            if (box === null) {
                res.status(404).json({ error: true, message: 'Box not found' });
                throw new Error('STOP');
            }
            if (box.belongsTo.toString() !== req.user.userId) {
                res.status(403).json({ error: true, message: 'This box does not belong to you' });
                throw new Error('STOP');
            }
            let modified = false;
            if (req.body.name !== undefined && req.body.name !== null && req.body.name.trim() !== '') {
                box.name = req.body.name;
                modified = true;
            }
            if (req.body.imageURL !== undefined && req.body.imageURL !== null && req.body.imageURL.trim() !== '') {
                box.imageURL = req.body.imageURL;
                modified = true;
            }
            if (modified) {
                return box.save();
            }
            return Promise.resolve(box);
        })
        .then((modifiedBox) => res.json({ error: false, box: modifiedBox }))
        .catch((err) => {
            if (err.message === 'STOP') return;
            next(err);
        });
});

// TODO: Delete a box


// Get all items in a box
router.get('/:boxId/items', (req, res, next) => {
    const boxId = req.params.boxId;
    Item.find({ insideBox: boxId })
        .exec()
        .then((items) => res.json({ error: false, items: items }))
        .catch((err) => next(err));
});

export default router;
