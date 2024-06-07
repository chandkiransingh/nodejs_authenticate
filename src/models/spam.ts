import * as mongoose from 'mongoose';
import { Schema, model } from 'mongoose';

const spamSchema: Schema = new Schema({
phoneNumber: {
    type: String,
    required: true
},
reason: {
    type: String,
    required: false
},
createdAt: {
    type: Date,
    default: Date.now
}
}, { collection: 'spamSchema' });

export default mongoose.model('spam', spamSchema);
