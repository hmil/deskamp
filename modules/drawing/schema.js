var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    path: [{
        p: [{
            x: Number,
            y: Number
        }]
    }]
});
