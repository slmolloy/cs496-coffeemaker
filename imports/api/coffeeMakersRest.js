import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { CoffeeMakers } from './coffeeMakers';

if (Meteor.isServer) {
  var Api = new Restivus({
    useDefaultAuth: false,
    prettyJson: true
  });

  Api.addCollection(CoffeeMakers);
}