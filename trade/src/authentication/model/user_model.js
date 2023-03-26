const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    mailActive: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    creditCart: {
        type: String,
        trim: true
    },
}, { collection: 'users', timestamps: true });



module.exports = {
    UserSchema
}





