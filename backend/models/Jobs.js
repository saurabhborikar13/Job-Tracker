const mongoose = require('mongoose'); 
const JobSchema = new mongoose.Schema({

    company: {
        type: String,
        required: [true, 'Plz provide compony name'],
        maxlength: 50
    },
    position: {
        type: String,
        required: [true, 'Please provide position'], // This field is mandatory
        maxlength: 100
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'], // Only these values are allowed
        default: 'pending'
    },
    dateApplied: {
        type: Date,
        default: Date.now // Automatically sets the current date
    }
});

// so that i can use it in sever.js
module.exports =  mongoose.model('Job',JobSchema);
