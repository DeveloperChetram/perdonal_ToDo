const express = require('express');
const router = express.Router()
const todoModel = require('../models/todo.model')

router.post('/todo',async (req,res)=>{
    const mongoRes = await todoModel.create(req.body)
    res.json(mongoRes)
})

router.get('/todo',async (req,res)=>{
    const todos = await todoModel.find()
    res.json(todos)
})



module.exports= router;