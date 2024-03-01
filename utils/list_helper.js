const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
 return blogs.reduce((max, item) => max.likes > item.likes ? max : item)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}