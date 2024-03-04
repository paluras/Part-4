const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})


blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    likes: body.likes
  }

  const updateBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updateBlog)
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0, // Defaulting to 0 if not provided
  })


  if (!blog.title || !blog.url) {
    return response.status(400).send({
      error: "Title or URL is required"
    })
  }

  try {
    const saveBlog = await blog.save()
    response.status(201).json(saveBlog)

  } catch (exception) {
    next(exception)
  }
})





module.exports = blogsRouter