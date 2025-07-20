const express = require('express');
require('dotenv').config();
const router = require('./src/routes/todo.route')
const GeminiRouter = require('./src/routes/gemini.route');
const connectToDB = require('./src/db/db')
const cors = require('cors')

const app = express()


app.use(cors())
connectToDB();

app.use(express.json())

app.get('/',(req,res)=>{
    res.json({
        data:"sampleData"
    })
})
app.use('/',router)
app.use('/', GeminiRouter);

app.listen(3000,()=>{
    console.log('server is running at port 3000')
})