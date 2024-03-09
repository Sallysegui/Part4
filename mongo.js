

//const password =  '1InCcqz3fTNvTjQO'
//const password2 = 'Uyy50vHLYc66enfs'
//const url = "mongodb+srv://sallysegui10:Uyy50vHLYc66enfs>@tests.lub3hrz.mongodb.net/?retryWrites=true&w=majority";
//user !MAuS2T_xqn7gM_

//sarah "TLbTykUbCdM7VW8c"

// fullsctackblogs   VyQO8e3l5CwHduyq

const mongoose = require('mongoose')

// if (process.argv.length<3) {
//   console.log('give password as argument')
//   process.exit(1)
// }

// const password = process.argv[2]


const url =
//"mongodb+srv://sallysegui10:1InCcqz3fTNvTjQO@tests.lub3hrz.mongodb.net/?retryWrites=true&w=majority";
//"mongodb+srv://sallysegui10:!MAuS2T_xqn7gM_@tests.lub3hrz.mongodb.net/?retryWrites=true&w=majority";
"mongodb+srv://sallysegui10:VyQO8e3l5CwHduyq@fullstackblogs.bvsgbor.mongodb.net/?retryWrites=true&w=majority";
// "mongodb+srv://<username>:<password>@tests.lub3hrz.mongodb.net/?retryWrites=true&w=majority";
//`mongodb+srv://sallysegui10:${password}@cluster0.zcpele5.mongodb.net/?retryWrites=true&w=majority`
//`mongodb+srv://sarahtaylor198500:${password}@fullstack.z9unjhh.mongodb.net/?retryWrites=true&w=majority`
//"mongodb+srv://sarahtaylor198500:TLbTykUbCdM7VW8c@cluster0.rujfo6r.mongodb.net/?retryWrites=true&w=majority";
mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  _id: Number,
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', noteSchema)


const blog = new Blog( {
  _id: 12,
  title: "jhuio;lsdf,;lsfg",
  author: "Robert C. Martin",
  url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
  likes: 2,
},
{
  _id:13,
  title: "aaaaaaa",
  author: "Robert C. Martin",
  url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
  likes: 0,
}
)

blog.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})