const dummy =(blogs) =>{
    return 1
}

const totalLikes = (blogsLikes) => {
    return blogsLikes.map(obj => obj.likes).reduce((a, b) => a + b, 0)

}



module.exports = {
    dummy,
    totalLikes
}