import * as mongoose from 'mongoose';
import { Schema, model } from 'mongoose';

const usersSchema: Schema = new Schema({
name: {
    type: String,
    required: true
},
phoneNumber: {
    type: String,
    required: true
},
email: {
    type: String,
    required: false
},
password: {
    type: String,
    required: true
},
spam: {
    type: Boolean,
    required: false,
    default: false
},
reason: {
    type: String,
    required: false
}
}, { collection: 'usersSchema' });

export default mongoose.model('users', usersSchema);
