const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    language: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    customInput: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model('Snippet', snippetSchema);