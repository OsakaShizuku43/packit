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
    description: {
        type: String
    },
    imageURL: {
        type: String
    }
});

export default mongoose.model('Box', boxSchema);
