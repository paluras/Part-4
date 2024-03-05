const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.delete('/:id' ,middleware.userExtractor, async (request, response) => {
 
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  
  if (user._id.toString() === blog.user.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).json("Blog deleted succesfully").end()
  } else {
    response.status(400).json("Unauthorised to delete").end()
  }

})


blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    likes: body.likes
  }

  const updateBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updateBlog)
})

blogsRouter.post('/', middleware.userExtractor,  async (request, response, next) => {
  const body = request.body
  const user = request.user
  console.log(user);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0, // Defaulting to 0 if not provided
    user: user.id

  })


  if (!blog.title || !blog.url) {
    return response.status(400).send({
      error: "Title or URL is required"
    })
  }

  try {
    const saveBlog = await blog.save()
    user.blogs = user.blogs.concat(saveBlog._id)
    await user.save()

    response.status(201).json(saveBlog)

  } catch (exception) {
    next(exception)
  }
})





module.exports = blogsRouter