'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Categories = models.category;

const authenticate = require('./concerns/authenticate');
const setUser = require('./concerns/set-current-user');
const setModel = require('./concerns/set-mongoose-model');

const index = (req, res, next) => {
  Categories.find()
    .then(categories => {
      let tags = {};
      for(let tag in categories){
        if(tags[categories[tag].category]) {
          tags[categories[tag].category] += 1;
        } else {
          tags[categories[tag].category] = 1;
        }
      }
      let tagsA = [];
      let j=1;
      for(let i in tags) {
        let temp = {};
        temp._id = j+'';
        temp.category = i;
        temp.count = tags[i]+'';
        temp.id = j+'';
        tagsA.push(temp);
        j+=1;
      }
      console.log(tagsA);
      //tags.id='587ffef41a6013eb19c098a0';
      res.json({'categories': tagsA});
      // res.json({
      //   categories: tagsA.map((e) =>
      //     e.toJSON({ virtuals: true, user: req.user })),
      // });
    })
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
