var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Task nust havea title'
    },
    date: {
        type: String,
        required: 'Task must have a date'
    },
    position: Number
});

module.exports = mongoose.model('Task', TaskSchema);