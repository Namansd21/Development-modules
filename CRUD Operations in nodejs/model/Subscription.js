const mongoose =require("mongoose")
const {Schema}=mongoose

const subscriptionSchema = new Schema({
    plan: { 
        type: String, 
        required: true, 
        trim: true 
    },
    cost: { 
        type: Number,
        required: true 
    },
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date, 
        required: true 
    },
    phoneNumber: { 
        type: String, 
        required: true, 
        trim: true 
    }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);