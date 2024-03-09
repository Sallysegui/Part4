const blogsRouter = require('express').Router()
const Blog = require('../models/blog_model')



blogsRouter.get('/', async (request, response ) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})



blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user

  if(!user){
    return response.status(401).json({ error: 'you need to log in' })
  }

  const blog = new Blog({
    title: body.title,
    author:body.author,
    url: body.url,
    likes: body.likes? body.likes : 0,
    created_at: Date.now(),
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})



blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  console.log(request.headers)

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})


blogsRouter.delete('/:id', async (request, response) => {
  console.log("delete route")
  const idBlog = request.params.id
  console.log(idBlog)
  const user = request.user
  // const  = await Blog.findById(idBlog)
  const blogToDelete = await Blog.findById(request.params.id)
  console.log(blogToDelete)
  const userId = user.id
  console.log ("userId")
  console.log (userId)
  console.log ("blogDelete.user")
  console.log (blogToDelete.user)
  if (blogToDelete.user.toString() === userId.toString() ) {
    await Blog.findByIdAndDelete(idBlog)
    response.status(204).end()
  } else {
    response.status(401).json({ error: `Unauthorized` })

  }
  // next()
})



blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body,
    { new: true, runValidators: true, context: 'query'  }
  )
  response.json(updatedBlog)
})


module.exports = blogsRouter