import { Meteor } from 'meteor/meteor';

import './helper';

const COFFEE_MAKERS = 'makers';
const COFFEE_MAKER = 'makers/:id';
const COFFEE_MAKER_USERS = 'makers/:id/users';
const COFFEE_MAKER_USER = 'makers/:id/users/:userId';

if (Meteor.isServer) {
  var Api = new Restivus({
    apiPath: 'api',
    defaultHeaders: {
      'Content-Type': 'application/json'
    },
    useDefaultAuth: false,
    prettyJson: true,
    version: 'v1'
  });

  Api.addRoute(COFFEE_MAKERS, { authRequired: false }, {
    get: function() {
      return Meteor.call('coffeeMakers.get', 0, 10);
    },
    post: function() {
      var name = this.bodyParams.name;
      var location = this.bodyParams.location;
      var volume = this.bodyParams.volume;
      var isPrivate = this.bodyParams.isPrivate;

      var result = 0;
      try {
        result = Meteor.call('coffeeMakers.insert', name, location, volume, isPrivate);
      } catch (exception) {
        console.log(exception);
        return Meteor.call('unknownError', 'post failed on ' + COFFEE_MAKERS);
      }
      if (result) {
        return Meteor.call('coffeeMakers.getOne', result);
      } else {
        return Meteor.call('unknownError', 'post failed on' + COFFEE_MAKERS)
      }
    },
    put: function() {
      return Meteor.call('badOperation', 'cannot put on ' + COFFEE_MAKERS);
    },
    delete: function () {
      return Meteor.call('badOperation', 'cannot delete on ' + COFFEE_MAKERS);
    }
  });

  Api.addRoute(COFFEE_MAKER, { authRequired: false }, {
    get: function() {
      var id = this.urlParams.id;
      var result = Meteor.call('coffeeMakers.getOne', id);
      if (result) {
        return result;
      } else {
        return Meteor.call('recordNotFoundError', id + ' not found');
      }
    },
    post: function() {
      return Meteor.call('badOperation', 'cannot post on ' + COFFEE_MAKER);
    },
    put: function() {
      var id = this.urlParams.id;
      var name = this.bodyParams.name;
      var location = this.bodyParams.location;
      var volume = this.bodyParams.volume;
      var isPrivate = this.bodyParams.isPrivate;

      var result = 0;
      try {
        result = Meteor.call('coffeeMakers.update', id, name, location, volume, isPrivate);
      } catch (exception) {
        console.log(exception);
        return Meteor.call('unknownError', 'put failed on ' + COFFEE_MAKER + ' for id=' + id);
      }
      if (result) {
        return Meteor.call('coffeeMakers.getOne', id);
      } else {
        Meteor.call('unknownError', 'put failed on ' + COFFEE_MAKER + ' for id=' + id);
      }
    },
    delete: function() {
      var id = this.urlParams.id;

      var result = 0;
      try {
        result = Meteor.call('coffeeMakers.remove', id);
      } catch (exception) {
        console.log(exception);
        return Meteor.call('unknownError', 'delete failed on ' + COFFEE_MAKER + ' for id=' + id);
      }
      if (result) {
        return Meteor.call('recordDeleted', COFFEE_MAKER, id);
      } else {
        Meteor.call('unknownError', 'delete failed on ' + COFFEE_MAKER + ' for id=' + id);
      }
    }
  });

  Api.addRoute(COFFEE_MAKER_USERS, { authRequired: false }, {
    get: function() {
      var id = this.urlParams.id;

      var result = Meteor.call('coffeeMakers.getOne', id);
      if (result) {
        if (result.users) {
          return result.users;
        } else {
          return Meteor.call('documentNotFoundError', 'users document not found on '
              + COFFEE_MAKER_USERS + ' for id=' + id);
        }
      } else {
        return Meteor.call('recordNotFoundError', id + ' not found');
      }
    },
    post: function() {

    }
  });

  Api.addRoute(COFFEE_MAKER_USER, { authRequired: false }, {
    get: function() {
      return Meteor.call('badOperation', 'cannot get on ' + COFFEE_MAKER_USER)
    }
  });
}