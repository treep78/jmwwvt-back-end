'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Categories = models.category;

const authenticate = require('./concerns/authenticate');
const setUser = require('./concerns/set-current-user');
const setModel = require('./concerns/set-mongoose-model');

const index = (req, res, next) => {
  Categories.find()
    .then(categories => res.json({
      categories: categories.map((e) =>
        e.toJSON({ virtuals: true, user: req.user })),
    }))
    .catch(next);
};

const show = (req, res) => {
  res.json({
    category: req.category.toJSON({ virtuals: true, user: req.user }),
  });
};

module.exports = controller({
  index,
  show,
}, { before: [
  { method: setUser, only: ['index', 'show'] },
  { method: authenticate, except: ['index', 'show'] },
  { method: setModel(Categories), only: ['show'] },
  { method: setModel(Categories, { forUser: true }), only: ['update', 'destroy'] },
], });
