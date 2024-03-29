import { Meteor } from 'meteor/meteor';

import './helper';

const USERS = 'users';
const USER = 'users/:id';


if (Meteor.isServer) {
  var Api = new Restivus({
    apiPath: 'api',
    defaultHeaders: {
      'Content-Type': 'application/json'
    },
    useDefaultAuth: true,
    prettyJson: true,
    version: 'v1'
  });

  Api.addRoute(USERS, { authRequired: true }, {
    get: function () {
      return Meteor.call('users.get', 0, 10);
    },
    post: {
      authRequired: false,
      action: function() {
        var username = this.bodyParams.username;
        var password = this.bodyParams.password;

        var result = 0;
        try {
          result = Meteor.call('users.insert', username, password);
        } catch (exception) {
          console.log(exception);
          return Meteor.call('unknownError', 'post failed on ' + USERS);
        }
        if (result) {
          var newRecord = Meteor.call('users.getOne', result);
          return Meteor.call('recordCreated', newRecord);
        } else {
          return Meteor.call('unknownError', 'post failed on' + USERS);
        }
      }
    },
    put: function() {
      return Meteor.call('badOperation', 'cannot put on ' + USERS);
    },
    delete: function() {
      return Meteor.call('badOperation', 'cannot delete on ' + USERS);
    }
  });

  Api.addRoute(USER, { authRequired: false }, {
    get: function() {
      var id = this.urlParams.id;
      var result = Meteor.call('users.getOne', id);
      if (result) {
        return result;
      } else {
        return Meteor.call('recordNotFoundError', id + ' not found');
      }
    },
    post: function() {
      return Meteor.call('badOperation', 'cannot post on ' + USER);
    },
    put: function() {
      var id = this.urlParams.id;
      var name = this.bodyParams.name;
      var email = this.bodyParams.email;

      var result = 0;
      try {
        result = Meteor.call('users.update', id, name, email);
      } catch (exception) {
        console.log(exception);
        return Meteor.call('unknownError', 'put failed on ' + USER + ' for id=' + id);
      }
      if (result) {
        return Meteor.call('users.getOne', id);
      } else {
        Meteor.call('unknownError', 'put failed on ' + USER + ' for id=' + id);
      }
    },
    delete: function() {
      var id = this.urlParams.id;

      // TODO: add code to remove user from all coffeeMakers

      var result = 0;
      try {
        result = Meteor.call('users.remove', id);
      } catch (exception) {
        console.log(exception);
        return Meteor.call('unknownError', 'delete failed on ' + USER + ' for id=' + id);
      }
      if (result) {
        return Meteor.call('recordDeleted', USER, id);
      } else {
        Meteor.call('unknownError', 'delete failed on ' + USER + ' for id=' + id);
      }
    }
  });
}