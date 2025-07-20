const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    text:String,
    done:Boolean,
    date:String
})

const todoModel = mongoose.model('Webtodo',todoSchema)

module.exports= todoModel;