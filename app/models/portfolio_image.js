'use strict';

const mongoose = require('mongoose');

const portfolio_imageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Portfolio_image = mongoose.model('Portfolio_image', portfolio_imageSchema);

module.exports = Portfolio_image;
