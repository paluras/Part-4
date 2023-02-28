const dummy =(blogs) =>{
    return 1
}

const totalLikes = (blogsLikes) => {
    return blogsLikes.map(obj => obj.likes).reduce((a, b) => a + b, 0)

}

const favoriteBlog =(blog) => {
    return blog.reduce((prev, curr) => 
        prev.likes > curr.likes ?
         prev.likes : 
         curr.likes
    )
}



module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}