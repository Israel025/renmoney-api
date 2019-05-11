const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  user_id:{
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  first_name:{
    type: String,
    required: true
  },
  last_name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password:{
    type: String,
    required: true,
    select: false
  },
  phone_number:{
    type: String,
    required: true
  },
  dob:{
    type: Date,
    required: true
  },
  gender:{
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  address:{
    type: String,
    required: true
  },
  bvn:{
    type: String,
    required: true
  },
  id_img:{
    type: Blob,
    required: true
  },
  user_img:{
    type: Blob,
    required: true
  },
  utility_img:{
    type: Blob,
    required: true
  }
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;