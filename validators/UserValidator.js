const joi = require("joi");

exports.CreateLeaveReqValidator = {
  user_id: joi.string().required(),
  first_name: joi.string().required(),
  last_name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  phone_number: joi.number().required(),
  dob: joi.date().required(),
  gender: joi.string().required(),
  address: joi.string().required(),
  bvn: joi.string().required(),
  id_img: joi.blob().required(),
  user_img: joi.blob().required(),
  utility_img: joi.blob().required(),
  time_stamp: joi.string().required()
}