const _ = require('lodash');

const dummy = (blogs) => {
  return blogs.length
    ? 0
    : 1
}


const totalLikes  = array => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return array.length === 0
    ? 0
    : array.reduce(reducer, 0)
}

const favoriteBlog = array => {
  const highest =  Math.max(...array.map(blog => blog.likes));
  const memberWithHighestMaxScore = array.find(blog => blog.likes === highest);

  return array.length === 0
    ? 0
    :  memberWithHighestMaxScore
}

const mostBlogs = array =>{
  const authors = _.uniqBy(array, 'author')
  const authorArray =  authors.map((blog) => { _.pick(blog, ['author']); return blog.author })
  console.log(authorArray)
  const authorBlogs = authorArray.map((auth) => {return { 'author': auth, 'blogsNumer': _.filter(array, { 'author': auth }).length };})
  console.log(authorBlogs)
  const highestBlogs =  Math.max(...authorBlogs.map((blog) => { return  blog.blogsNumer }));
  console.log(highestBlogs )
  const result = authorBlogs.find(({ blogsNumer}) => blogsNumer === highestBlogs);
  console.log(result)
  return array.length === 0
    ? 0
    : result
}

const mostLikes = array => {
  const authors = _.uniqBy(array, 'author')
  const authorArray =  authors.map((blog) => { _.pick(blog, ['author']); return blog.author })
  console.log( authorArray)
  const authorLikesArray = (variable) => { return array.filter(blog => blog.author=== variable)}
  const sumLikesAuthor = (vari) => {return _.sumBy(authorLikesArray(vari),'likes') }
  // console.log(sumLikesAuthor ('Robert C. Martin'))
  const authorTotalLikes = authorArray.map((au) => { return { 'author':au, 'likes':sumLikesAuthor(au) }})
  console.log(authorTotalLikes)

  const highestLikes =  Math.max(...authorTotalLikes.map((blog) => { return  blog.likes }));
  console.log(highestLikes)
  // const result = inventory.find(({ name }) => name === "cherries");
  const result = authorTotalLikes.find(({ likes }) => likes === highestLikes);
  console.log(result)

  return array.length === 0
    ? 0
    : result
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}