const User = require('../models/user')
const mid = require ('../utils/middleware')

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}


const user = async ()=>{
    
    return mid.tokenExtractor
}

module.exports = {
    user,
    usersInDb,
    
}