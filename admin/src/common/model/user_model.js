const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const UserSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "name field can't space"],
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
    mailActive: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String,
        default: "asdasd"
    }
}, { collection: 'users', timestamps: true });








module.exports = { UserSchema };





