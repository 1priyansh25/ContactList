import mongoose from "mongoose";

const constactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number
    },
    email: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'   
    }
})

const Contact = mongoose.model('contact', constactSchema);
export default Contact;