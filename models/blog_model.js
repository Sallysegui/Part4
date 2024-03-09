const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: 8,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  created_at: { type: Date, required: true, default: Date.now },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// .toJSON method is called everytime res.send is called
// id is sent in response but no changed in the db
blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});


// userSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//       returnedObject.id = returnedObject._id.toString()
//       delete returnedObject._id
//       delete returnedObject.__v
//       delete returnedObject.passwordHash
//   }
// })

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;