
const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}





const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token =  authorization.replace('Bearer ', '')
  } else if (!authorization) {
    request.token = null}

  next()
}
const userExtractor = async (request, response, next) => {
  const token = request.token
  if (!token) {
    request.token = null
  } else {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    request.user = await User.findById(decodedToken.id)
    console.log(" request.user",  request.user)
  }
  next()
}


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  }

  next(error)
}


module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}