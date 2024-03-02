const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {

  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0, // Defaulting to 0 if not provided
  })
  try {
    const saveBlog = await blog.save()
    response.status(201).json(saveBlog)

  } catch (exception) {
    next(exception)
  }
})





module.exports = blogsRouter