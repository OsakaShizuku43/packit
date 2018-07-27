import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const boxSchema = new Schema({
    belongsTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String
    },
    items: [{
        type: Schema.Types.ObjectId,
        ref: 'Item'
    }],
    imageURL: {
        type: String
    }
});

export default mongoose.model('Box', boxSchema);
