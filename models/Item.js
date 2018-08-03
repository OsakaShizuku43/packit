import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    imageURL: {
        type: String
    },
    belongsTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    insideBox: {
        type: Schema.Types.ObjectId,
        ref: 'Box'
    }
});

export default mongoose.model('Item', itemSchema);
