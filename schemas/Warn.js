const mongoose = require('mongoose');

const WarnsSchema = mongoose.Schema({
    //Guild Id
    id: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },

    warnings: {
        type: [Object],
        required: true,
    },

})
mongoose.set('useFindAndModify', false);

module.exports = mongoose.model('warn-db', WarnsSchema)