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
    useDefaultAuth: false,
    prettyJson: true,
    version: 'v1'
  });

  Api.addRoute(USERS, { authRequired: false }, {
    get: function() {
      return Meteor.call('users.get', 0, 10);
    },
    post: function() {
      var name = this.bodyParams.name;
      var email = this.bodyParams.email;

      try {
        var result = Meteor.call('users.insert', name, email);
      } catch (exception) {
        console.log(exception);
        return Meteor.call('unknownError', 'post failed on ' + USERS);
      }
      return Meteor.call('users.getOne', result);
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
      return Meteor.call('users.getOne', this.urlParams.id);
    }
  })
}