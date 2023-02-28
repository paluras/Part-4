const http = require('http')
const express = require('express')

const cors = require('cors')
const blogRouter = require('./controllers/blogs')
const mongoose = require('mongoose')
const app = express()

const mongoUrl = 'mongodb+srv://paluraandrei1:@cluster0.0pgwozk.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogRouter)

module.exports = app