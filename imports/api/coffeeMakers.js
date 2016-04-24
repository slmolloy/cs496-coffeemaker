import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Random } from 'meteor/random';

export const CoffeeMakers = new Mongo.Collection('coffeeMakers');

Meteor.methods({
  'coffeeMakers.get'(skip, limit) {
    check(skip, Number);
    check(limit, Number);

    var result = CoffeeMakers.find({}, {skip: skip, limit: limit}).fetch();
    return result;
  },
  'coffeeMakers.getOne'(id) {
    check(id, String);

    var result = CoffeeMakers.findOne({'_id': id});
    return result;
  },
  'coffeeMakers.insert'(name, location, volume, isPrivate) {
    check(name, String);
    check(location, String);
    check(volume, Number);
    check(isPrivate, Boolean);

    var token = Random.secret();

    var result = CoffeeMakers.insert({
      name,
      token,
      location,
      volume,
      isPrivate,
      on: false,
      createdAt: new Date()
    });
    return result;
  },
  'coffeeMakers.update'(id, name, location, volume, isPrivate) {
    check(id, String);
    check(name, String);
    check(location, String);
    check(volume, Number);
    check(isPrivate, Boolean);

    CoffeeMakers.update(id, {$set: {
      name,
      location,
      volume,
      isPrivate
    }});
  },
  'coffeeMakers.remove'(coffeeMakerId) {
    check(coffeeMakerId, String);
    
    CoffeeMakers.remove(coffeeMakerId);
  },
});