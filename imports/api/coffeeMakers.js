import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const CoffeeMakers = new Mongo.Collection('coffeeMakers');

Meteor.methods({
  'coffeeMakers.insert'(name, url, location, volume, isPrivate) {
    check(name, String);
    check(url, String);
    check(location, String);
    check(volume, String);
    check(isPrivate, Boolean);

    CoffeeMakers.insert({
      name,
      url,
      location,
      volume,
      isPrivate,
      createdAt: new Date()
    });
  },
  'coffeeMakers.remove'(coffeeMakerId) {
    check(coffeeMakerId, String);
    
    CoffeeMakers.remove(coffeeMakerId);
  },
});