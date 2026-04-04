"use strict";

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    min: [10, 'at least 10 numbers']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    min: [6, 'password must contain at least 6 numbers'],
    max: 12
  },
  identificationType: {
    type: String,
    required: [true, 'Please add identification type'],
    "enum": ['driver license', 'passport', 'national ID']
  },
  identificationNumber: {
    type: String,
    required: [true, 'Please add the identification number'],
    min: [6, 'at least 6 numbers'],
    max: 12,
    unique: true
  },
  balance: {
    type: Number,
    "default": 1000
  },
  moneySend: {
    type: Number,
    "default": 0
  },
  moneyReceived: {
    type: Number,
    "default": 0
  },
  requestReceived: {
    type: Number,
    "default": 0
  },
  transactionLimit: {
    type: Number,
    "default": 5000 // Daily transaction limit in rupees

  },
  address: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  isVerified: {
    type: Boolean,
    "default": false
  },
  isAdmin: {
    type: Boolean,
    "default": false
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('User', userSchema);
//# sourceMappingURL=userModal.dev.js.map
