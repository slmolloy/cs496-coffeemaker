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
      currentVolume: 0,
      createdAt: new Date()
    });
    return result;
  },
  'coffeeMakers.update'(id, name, location, volume, isPrivate) {
    check(id, String);
    var update = {};
    if (name) {
      check(name, String);
      update.name = name;
    }
    if (location) {
      check(location, String);
      update.location = location;
    }
    if (volume) {
      check(volume, Number);
      update.volume = volume;
    }
    if (isPrivate) {
      check(isPrivate, Boolean);
      update.isPrivate = isPrivate;
    }

    var result = CoffeeMakers.update(id, {$set: update});
    return result;
  },
  'coffeeMakers.remove'(id) {
    check(id, String);
    
    var result = CoffeeMakers.remove(id);
    return result;
  },
});