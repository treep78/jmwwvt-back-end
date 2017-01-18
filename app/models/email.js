'use strict';

const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

emailSchema.virtual('length').get(function length() {
  return this.text.length;
});

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
