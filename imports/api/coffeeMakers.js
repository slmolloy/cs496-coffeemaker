import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const CoffeeMakers = new Mongo.Collection('coffeeMakers');

Meteor.methods({
  'coffeeMakers.insert'(name, url, location, volume, isPrivate) {
    check(name, String);
    check(url, String);
    check(location, String);
    check(volume, Number);
    check(isPrivate, Boolean);

    var result = CoffeeMakers.insert({
      name,
      url,
      location,
      volume,
      isPrivate,
      createdAt: new Date()
    });
    return result;
  },
  'coffeeMakers.update'(id, name, url, location, volume, isPrivate) {
    check(id, String);
    check(name, String);
    check(url, String);
    check(location, String);
    check(volume, Number);
    check(isPrivate, Boolean);

    CoffeeMakers.update(id, {$set: {
      name,
      url,
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