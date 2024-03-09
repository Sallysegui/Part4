const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  // console.log(password)
  if(!password || !username) {
    return response.status(400).json({ error: 'no password' })
  } else if(password.length < 3 || username.length < 3){
    return response.status(400).json({ error: 'password or username must be at least 3 characters long' })
  } else {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    console.log(passwordHash)
    const user = new User({
      username,
      name,
      passwordHash,
    })
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  }
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users)
  console.log(users)
})

module.exports = usersRouter