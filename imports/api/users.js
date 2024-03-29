import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import './coffeeMakers';

Meteor.methods({
  'users.get'(skip, limit) {
    check(skip, Number);
    check(limit, Number);

    var result = Meteor.users.find({}, {skip: skip, limit: limit, fields: {username: 1}}).fetch();
    return result;
  },
  'users.getOne'(id) {
    check(id, String);

    var result = Meteor.users.findOne({'_id': id}, {fields: {username: 1}});
    return result;
  },
  'users.insert'(username, password) {
    check(username, String);
    check(password, String);

    var result = Accounts.createUser({
      username,
      password
    });
    // var result = Meteor.users.insert({
    //   name,
    //   username
    // });
    return result;
  },
  'users.update'(id, name, email) {
    check(id, String);
    var update = {};
    if (name) {
      check(name, String);
      update.name = name;
    }
    if (email) {
      check(email, String);
      update.email = email;
    }

    var result = Meteor.users.update(id, {$set: update});
    return result;
  },
  'users.remove'(id) {
    check(id, String);

    var result = Meteor.users.remove(id);
    Meteor.call('coffeeMakers.removeUserFromAll', id);
    return result;
  }
});