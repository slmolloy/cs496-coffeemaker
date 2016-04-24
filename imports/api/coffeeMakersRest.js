import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { CoffeeMakers } from './coffeeMakers';

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

  Api.addRoute('makers', { authRequired: false }, {
    get: function() {
      return CoffeeMakers.find({}, {skip: 0, limit: 10}).fetch();
    },
    post: function() {
      var name = this.bodyParams.name;
      var url = this.bodyParams.url;
      var location = this.bodyParams.location;
      var volume = this.bodyParams.volume;
      var isPrivate = this.bodyParams.isPrivate;

      try {
        var result = Meteor.call('coffeeMakers.insert', name, url, location, volume, isPrivate);
      } catch (exception) {
        console.log(exception);
        return {
          statusCode: 400,
          header: {
            'Content-Type': 'application/json'
          },
          body: {'error': 'unable to post'}
        };
      }
      return CoffeeMakers.findOne({"_id": result});
    },
    put: function() {
      return {
        statusCode: 400,
        header: {
          'Content-Type': 'application/json'
        },
        body: {'error': 'operation not allowed'}
      };
    },
    delete: function () {
      return {
        statusCode: 400,
        header: {
          'Content-Type': 'application/json'
        },
        body: {'error': 'operation not allowed'}
      }
    }
  });

  Api.addRoute('makers/:id', { authRequired: false }, {
    get: function() {
      return CoffeeMakers.findOne({"_id": this.urlParams.id});
    }
  });
}