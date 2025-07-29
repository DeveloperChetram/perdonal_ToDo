const express = require('express');
const router = express.Router();
const todoModel = require('../models/todo.model'); // You imported the model as 'todoModel'

// This route is correct
router.post('/todo', async (req, res) => {
    const mongoRes = await todoModel.create(req.body);
    res.json(mongoRes);
});

// This route is correct
router.get('/todo', async (req, res) => {
    const todos = await todoModel.find();
    res.json(todos);
});

// PATCH update done status
router.patch("/todo/:id", async (req, res) => {
    const { id } = req.params;
    const { done } = req.body;
    // FIX: Use 'todoModel' instead of 'Task'
    const task = await todoModel.findByIdAndUpdate(id, { done }, { new: true });
    res.json(task);
});

// DELETE task
router.delete("/todo/:id", async (req, res) => {
    const { id } = req.params;
    // FIX: Use 'todoModel' instead of 'Task'
    await todoModel.findByIdAndDelete(id);
    res.json({ message: "Task deleted" });
});

module.exports = router;