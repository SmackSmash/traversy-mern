const mongoose = require('mongoose');
const Joi = require('joi');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('users', UserSchema);

const validateSignUp = Joi.object().keys({
  name: Joi.string()
    .required()
    .min(3)
    .max(40),
  email: Joi.string()
    .required()
    .email({ minDomainAtoms: 2 }),
  password: Joi.string()
    .required()
    .min(7)
});

const validateSignIn = Joi.object().keys({
  email: Joi.string()
    .required()
    .email({ minDomainAtoms: 2 }),
  password: Joi.string()
    .required()
    .min(7)
});

module.exports = {
  User,
  validateSignUp,
  validateSignIn
};
