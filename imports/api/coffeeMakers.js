import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Random } from 'meteor/random';

export const CoffeeMakers = new Mongo.Collection('coffeeMakers');

function parseTerms(context, terms) {
  if (Meteor.isServer) {
    if (context && !context.userId && terms && terms.userId) {
      check(terms.userId, String);
      context.userId = terms.userId;
    }
  }

  if (typeof(Meteor.user) === typeof(Function) && Meteor.user().username) {
    context.username = Meteor.user().username;
  } else if (terms.username) {
    context.username = terms.username;
  }
}

Meteor.methods({
  'coffeeMakers.get'(terms) {
    var skip, limit, mine;

    if (terms) {
      if (terms.skip || terms.skip === 0) {
        check(terms.skip, Number);
        skip = terms.skip;
      } else {
        skip = 0;
      }
      if (terms.limit || terms.limit === 0) {
        check(terms.limit, Number);
        limit = terms.limit;
      } else {
        limit = 10;
      }
      if (terms.mine) {
        check(terms.mine, Boolean);
        mine = terms.mine;
      } else {
        mine = false;
      }
    } else {
      skip = 0;
      limit = 10;
      mine = false;
    }

    parseTerms(this, terms);

    var find = {};
    if (mine) {
      find = {owner: this.userId};
    } else {
      find = {$or: [
        {owner: this.userId},
        {isPrivate: false}
      ]}
    }

    var result = CoffeeMakers.find(find, {skip: skip, limit: limit}).fetch();
    return result;
  },
  'coffeeMakers.getOne'(id) {
    check(id, String);

    var result = CoffeeMakers.findOne({'_id': id});
    return result;
  },
  'coffeeMakers.insert'(terms) {
    check(terms.name, String);
    check(terms.location, String);
    check(terms.volume, Number);
    check(terms.isPrivate, Boolean);

    var token = Random.secret();

    parseTerms(this, terms);

    var result = CoffeeMakers.insert({
      name: terms.name,
      token,
      location: terms.location,
      volume: terms.volume,
      isPrivate: terms.isPrivate,
      latitude: terms.latitude,
      longitude: terms.longitude,
      isOn: false,
      currentVolume: 0,
      createdAt: new Date(),
      owner: this.userId,
      username: this.username
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