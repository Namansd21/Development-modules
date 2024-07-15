const { number } = require("joi");
const mongoose = require("mongoose")
const { Schema } = mongoose
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    phoneNumber: { 
        type: String, 
        required: true, 
        trim: true 
    },
    age: { 
        type: Number, 
        required: true 
    },
    monthlyIncome: {
        type: Number,
        required: true }
});

userSchema.plugin(passportLocalMongoose)
const User = mongoose.model("User", userSchema)
module.exports = User