'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Email = models.email;

const authenticate = require('./concerns/authenticate');
const setUser = require('./concerns/set-current-user');
const setModel = require('./concerns/set-mongoose-model');

const mail = require('mail').Mail({
  host: 'smtp.gmail.com',
  username: 'me@gmail.com',
  password: '**password**'
});

const index = (req, res, next) => {
  Email.find()
    .then(emails => res.json({
      emails: emails.map((e) =>
        e.toJSON({ virtuals: true, user: req.user })),
    }))
    .catch(next);
};

const show = (req, res) => {
  res.json({
    email: req.email.toJSON({ virtuals: true, user: req.user }),
  });
};

const sendMail = (req, res, next) => {
  mail.message({
    from: 'sender@example.net',
    to: ['recipient@somewhere.org'],
    subject: 'Hello from Node.JS'
  })
  .body('Node speaks SMTP!')
  .send(function(err) {
    if (err) {
      throw err;
    }
    console.log('Sent!');
  });
};

const create = (req, res, next) => {
  let email = Object.assign(req.body.email, {
    _owner: req.user._id,
  });
  Email.create(email)
    .then(email =>
      res.status(201)
        .json({
          email: email.toJSON({ virtuals: true, user: req.user }),
        }))
    .catch(next);
};

const update = (req, res, next) => {
  delete req.body._owner;  // disallow owner reassignment.
  req.email.update(req.body.email)
    .then(() => res.sendStatus(204))
    .catch(next);
};

const destroy = (req, res, next) => {
  req.email.remove()
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
  { method: setModel(Email), only: ['show'] },
  { method: setModel(Email, { forUser: true }), only: ['update', 'destroy'] },
], });
