import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

Meteor.methods({
  'users.get'(skip, limit) {
    check(skip, Number);
    check(limit, Number);

    var result = Meteor.users.find({}, {skip: skip, limit: limit}).fetch();
    return result;
  },
  'users.getOne'(id) {
    check(id, String);

    var result = Meteor.users.findOne({'_id': id});
    return result;
  },
  'users.insert'(name, email) {
    check(name, String);
    check(email, String);

    var result = Meteor.users.insert({
      name,
      email
    });
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
    return result;
  }
});