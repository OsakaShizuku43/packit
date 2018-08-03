import express from 'express';
const router = express.Router();

// Models
import Item from '../models/Item';
import Box from '../models/Box';

// Routes

// Create a new item
router.post('/', (req, res, next) => {
    if (req.body.category === undefined || req.body.name === undefined) {
        res.status(400).json({ error: true, message: 'Invalid item information' });
        return;
    }
    Box.findById(req.body.boxId).exec()
        .then((box) => {
            let boxId = box === null ? undefined : box._id;
            if (box !== null && box.belongsTo.toString() !== req.user.userId) {
                res.status(403).json({ error: true, message: 'This box does not belong to you.' });
                throw Error('STOP');
            }
            const newItem = new Item({
                category: req.body.category,
                name: req.body.name,
                quantity: req.body.quantity || 1,
                imageURL: req.body.imageURL,
                belongsTo: req.user.userId,
                insideBox: boxId
            });
            return newItem.save();
        })
        .then((item) => {
            res.json({
                error: false,
                itemId: item._id
            });
        })
        .catch((err) => {
            if (err.message === 'STOP') return;
            next(err);
        });
});

// Get all items belonging to current user
router.get('/', (req, res) => {
    Item.find({ belongsTo: req.user.userId })
        .populate('insideBox')
        .exec()
        .then((items) => res.json({ error: false, items: items }));
});

// Search all items by name
router.get('/name/:name', (req, res) => {
    Item.find({ 
        name: { $regex: '.*' + req.params.name + '.*' },
        belongsTo: req.user.userId
    })
        .populate('insideBox')
        .exec()
        .then((items) => res.json({ error: false, items: items }));
});

// Search all items fall in specific category
router.get('/category/:category', (req, res) => {
    Item.find({
        category: req.params.category,
        belongsTo: req.user.userId
    })
        .populate('insideBox')
        .exec()
        .then((items) => res.json({ error: false, items: items }));
});

// Get the detailed information of an item
router.get('/:itemId', (req, res, next) => {
    Item.findById(req.params.itemId)
        .populate('insideBox')
        .exec()
        .then((item) => {
            if (item === null) {
                res.status(404).json({ error: true, message: 'Item not found.' });
                throw Error('STOP');
            }
            if (item.belongsTo.toString() !== req.user.userId) {
                res.status(403).json({ error: true, message: 'Item does not belong to you.' });
                throw Error('STOP');
            }
            res.json(item);
        })
        .catch((err) => {
            if (err.message === 'STOP') return;
            next(err);
        });
});

// Modify the information of an existing item
router.put('/:itemId', (req, res, next) => {
    Item.findById(req.params.itemId)
        .exec()
        .then((item) => {
            if (item === null) {
                res.status(404).json({ error: true, message: 'Item not found' });
                throw Error('STOP');
            }
            if (item.belongsTo.toString() !== req.user.userId) {
                res.status(403).json({ error: true, message: 'Item does not belong to you.' });
                throw Error('STOP');
            }
            if (req.body.quantity) item.quantity = req.body.quantity;
            if (req.body.category) item.category = req.body.category;
            if (req.body.name) item.name = req.body.name;
            if (req.body.insideBox) item.insideBox = req.body.insideBox;
            return item.save();
        })
        .then((modifiedItem) => res.json(modifiedItem))
        .catch((err) => {
            if (err.message === 'STOP') return;
            next(err);
        });
});

// Delete an existing item
router.delete('/:itemId', (req, res, next) => {
    Item.findById(req.params.itemId)
        .exec()
        .then((item) => {
            if (item === null) {
                res.status(404).json({ error: true, message: 'Item not found' });
                throw Error('STOP');
            }
            if (item.belongsTo.toString() !== req.user.userId) {
                res.status(403).json({ error: true, message: 'Item does not belong to you.' });
                throw Error('STOP');
            }
            return item.remove();
        })
        .then(() => res.json({ error: false }))
        .catch((err) => {
            if (err.message === 'STOP') return;
            next(err);
        });
});

export default router;
