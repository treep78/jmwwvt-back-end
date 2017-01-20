'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Portfolio_images = models.portfolio_image;
const Categories = models.category;

const authenticate = require('./concerns/authenticate');
const setUser = require('./concerns/set-current-user');
const setModel = require('./concerns/set-mongoose-model');

const index = (req, res, next) => {
  Portfolio_images.find()
    .then(portfolio_images => res.json({
      portfolio_images: portfolio_images.map((e) =>
        e.toJSON({ virtuals: true, user: req.user })),
    }))
    .catch(next);
};

const show = (req, res) => {
  res.json({
    portfolio_image: req.portfolio_image.toJSON({ virtuals: true, user: req.user }),
  });
};

const create = (req, res, next) => {
  let portfolio_image = Object.assign(req.body.portfolio_image, {
    _owner: req.user._id,
  });
let category = Object.assign({category: req.body.portfolio_image.category}, {_owner: req.user._id,});
  Portfolio_images.create(portfolio_image)
    .then(portfolio_image => {
      let link = portfolio_image.link.split('');
      let success=false;
      for(let i=0; i<link.length;i++) {
        if(link[i] === '.'){
          let ext = link[i+1]+link[i+2]+link[i+3];
          if(ext === 'png' || ext === 'jpg') {
            success=true;
            res.status(201)
              .json({
                portfolio_image: portfolio_image.toJSON({ virtuals: true, user: req.user }),
              })
              .then(Categories.create(category))
              .catch(next);
            }
            break;
          }
        }
        if(!success){
          res.status(400).json({ error: 'must me a .png or .jpg link. Also please don\'t send CURL requests, use the app.'});
        }
      })
      .catch(next);
};

const update = (req, res, next) => {
  delete req.body._owner;  // disallow owner reassignment.
  req.portfolio_image.update(req.body.portfolio_image)
    .then(() => res.sendStatus(204))
    .catch(next);
};

const destroy = (req, res, next) => {
  req.portfolio_image.remove()
    .then(() => res.sendStatus(204))
    .catch(next);
};

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy,
}, { before: [
  { method: setUser, only: ['index', 'show'] },
  { method: authenticate, except: ['index', 'show'] },
  { method: setModel(Portfolio_images), only: ['show'] },
  { method: setModel(Portfolio_images, { forUser: true }), only: ['update', 'destroy'] },
], });
