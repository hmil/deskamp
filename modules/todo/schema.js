var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    title: String,
    items: [{
            name: String,
            state: Boolean
    }]
});
