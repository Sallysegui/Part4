const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog_model')
mongoose.set("bufferTimeoutMS", 30000)


beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('cleared')

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})


test('there is an id identifier', async () => {
  const response = await api.get('/api/blogs')
  const blogId = response.body.map(r => r.id)
  expect(blogId).toBeDefined();
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: "async/await simplifies making async calls",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/testasyncwait/TDD-Harms-Architecture.html",
    likes: 34
  }

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkVtaWx5IiwiaWQiOiI2NWMzOTFiMDg1ZDkwY2RiZTkxZmU5NWUiLCJpYXQiOjE3MDczMTU3MzksImV4cCI6MTcwNzMxOTMzOX0.9MSq88cyAdWngt0l0H8AtIijxFLoetTXsrpcw7-PkdQ"

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  const contents = blogsAtEnd.map(n => n.title)
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )
})


test('if the likes property is missing from the request it will default to the value 0', async () => {
  const newBlog = {
    title: "async/await simplifies making async calls",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/testasyncwait/TDD-Harms-Architecture.html"
  }
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkVtaWx5IiwiaWQiOiI2NWMzOTFiMDg1ZDkwY2RiZTkxZmU5NWUiLCJpYXQiOjE3MDczMTU3MzksImV4cCI6MTcwNzMxOTMzOX0.9MSq88cyAdWngt0l0H8AtIijxFLoetTXsrpcw7-PkdQ"

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  const contents = blogsAtEnd.map(n => n.likes)
  expect(contents).toContain(0)
})

test('blog without title or url', async () => {
  const newBlog = {
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/testasyncwait/TDD-Harms-Architecture.html",
    likes: 34
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(400)
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

  const newBlogB = {
    title: "lalalalalalalala",
    author: "Robert C. Martin",
    likes: 34
  }
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkVtaWx5IiwiaWQiOiI2NWMzOTFiMDg1ZDkwY2RiZTkxZmU5NWUiLCJpYXQiOjE3MDczMTU3MzksImV4cCI6MTcwNzMxOTMzOX0.9MSq88cyAdWngt0l0H8AtIijxFLoetTXsrpcw7-PkdQ"

  await api
    .post('/api/blogs')
    .send(newBlogB)
    .set('Authorization', `Bearer ${token}`)
    .expect(400)
  const blogsAtEndB = await helper.blogsInDb()
  expect(blogsAtEndB).toHaveLength(helper.initialBlogs.length)
})



test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  )

  const contents = blogsAtEnd.map(r => r.title)

  expect(contents).not.toContain(blogToDelete.title)
})

test('updating likes', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkVtaWx5IiwiaWQiOiI2NWMzOTFiMDg1ZDkwY2RiZTkxZmU5NWUiLCJpYXQiOjE3MDczMTU3MzksImV4cCI6MTcwNzMxOTMzOX0.9MSq88cyAdWngt0l0H8AtIijxFLoetTXsrpcw7-PkdQ"

  const newBlog = {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 3
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  console.log(blogsAtEnd[0].likes)
  const numberLikes = blogsAtEnd[0].likes
  expect(numberLikes).toBe(
    3
  )
})



test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(201)
    .expect('Content-Type', /application\/json/)
}, 290000)




test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})


test('a specific note is within the returned notes', async () => {
  console.log('before test')
  const response = await api.get('/api/blogs')
  const authors = response.body.map(r => r.author)
  expect(authors).toContain(
    'Robert C. Martin'
  )
})



test('blog without content is not added', async () => {
  const newBlog = {
    likes: 3
  }


  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkVtaWx5IiwiaWQiOiI2NWMzOTFiMDg1ZDkwY2RiZTkxZmU5NWUiLCJpYXQiOjE3MDczMTU3MzksImV4cCI6MTcwNzMxOTMzOX0.9MSq88cyAdWngt0l0H8AtIijxFLoetTXsrpcw7-PkdQ"


  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(400)
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})



afterAll(async () => {
  await mongoose.connection.close()
})


test('adding a new blog', async () => {

  const newBlog = {
    title: "async/await simplifies making async calls yy",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/testasyncwait/TDD-Harms-Architecture.html",
    likes: 34,
    created_at: Date.now(),
    "id": "65c391b085d90cdbe91fe95e"
  }

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkVtaWx5IiwiaWQiOiI2NWMzOTFiMDg1ZDkwY2RiZTkxZmU5NWUiLCJpYXQiOjE3MDczMTU3MzksImV4cCI6MTcwNzMxOTMzOX0.9MSq88cyAdWngt0l0H8AtIijxFLoetTXsrpcw7-PkdQ"
  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  const contents = blogsAtEnd.map(n => n.title)
  expect(contents).toContain(
    'async/await simplifies making async calls yy'
  )
})


test('a blog with no token is not added', async () => {

  const newBlog = {
    title: "async/await simplifies making async calls yy",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/testasyncwait/TDD-Harms-Architecture.html",
    likes: 34,
    created_at: Date.now(),
    "id": "65c391b085d90cdbe91fe95e"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

})
