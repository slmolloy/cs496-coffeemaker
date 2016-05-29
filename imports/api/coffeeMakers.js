import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Random } from 'meteor/random';

export const CoffeeMakers = new Mongo.Collection('coffeeMakers');

views = {};

views.findAll = function(terms) {
  return {
    find: {},
    sort: {sort: {createdAt: -1}},
    limit: terms.limit
  }
};

views.findMine = function(terms) {
  return {
    find: {username: Meteor.user().username},
    sort: {sort: {createdAt: -1}},
    limit: terms.limit
  }
};

queryConstructor = function(terms) {
  var viewFunction = views[terms.viewName];
  var parameters = viewFunction(terms);

  if (parameters.limit > 100) {
    parameters.limit = 100;
  }

  return parameters;
}

if (Meteor.isServer) {
  Meteor.publish('coffeeMakers', function(terms) {
    var parameters = queryConstructor(terms);
    return Meteor.call(parameters.method, )
  });
}

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
  'coffeeMakers.insert'(name, location, volume, isPrivate, latitude, longitude) {
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
      latitude,
      longitude,
      isOn: false,
      currentVolume: 0,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
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
  'coffeeMakers.removeAll'() {
    return CoffeeMakers.remove({});
  },
  'coffeeMakers.addUser'(id, userId, permissions) {
    check(id, String);
    check(userId, String);

    var user = Meteor.call('users.getOne', userId);

    if (user) {
      var newUser = {};
      newUser.name = user.name;
      newUser.id = userId;
      newUser.permissions = permissions;

      return CoffeeMakers.update(id, {$push: {users: newUser}});
    } else {
      return 0;
    }
  },
  'coffeeMakers.removeUser'(id, userId) {
    check(id, String);
    check(userId, String);

    var result = 0;
    try {
      result = CoffeeMakers.update(id, {$pull: {users: {id: userId}}});
    } catch (exception) {
      console.log(exception);
    }
    if (result) {
      return result;
    } else {
      return 0;
    }
  },
  'coffeeMakers.removeUserFromAll'(userId) {
    check(userId, String);

    var result = 0;
    try {
      result = CoffeeMakers.update({}, {$pull: {users: {id: userId}}});
    } catch (exception) {
      console.log(exception);
    }
    if (result) {
      return result;
    } else {
      return 0;
    }
  },
});