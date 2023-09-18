let mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://monir198321:0799250037@cluster0.zc4yiba.mongodb.net/?retryWrites=true&w=majority"
);
let userschma = new mongoose.Schema({
  id: String,
  street: String,
  city: String,
  province: String,
  price: Number,
  rooms: Number,
  square: Number,
  describe: String,
  phnum: Number,
  photo: String,
  sellrent: String,
});
let adminschma = new mongoose.Schema({
  street: String,
  city: String,
  province: String,
  price: Number,
  rooms: Number,
  square: Number,
  describe: String,
  phnum: Number,
  photo: String,
  sellrent: String,
});
let usershema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
let database = mongoose.model("housescollections", userschma);
let adminmodel = mongoose.model("admincollection", adminschma);
let usermodel = mongoose.model("user", usershema);
module.exports = { database, adminmodel, usermodel };
