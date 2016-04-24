import { Meteor } from 'meteor/meteor';

import './helper';

const COFFEE_MAKERS = 'makers';
const COFFEE_MAKER = 'makers/:id';

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
      var url = this.bodyParams.url;
      var location = this.bodyParams.location;
      var volume = this.bodyParams.volume;
      var isPrivate = this.bodyParams.isPrivate;

      try {
        var result = Meteor.call('coffeeMakers.insert', name, location, volume, isPrivate);
      } catch (exception) {
        console.log(exception);
        return Meteor.call('unknownError', 'post failed on ' + COFFEE_MAKERS);
      }
      //return CoffeeMakers.findOne({"_id": result});
      return Meteor.call('coffeeMakers.getOne', result);
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
      return Meteor.call('coffeeMakers.getOne', this.urlParams.id);
    }
  });
}