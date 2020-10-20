const mongoose = require('mongoose')

const todoModelModel = mongoose.model('todo', {
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

module.exports = todoModelModel
