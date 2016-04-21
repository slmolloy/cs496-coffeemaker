import { Template } from 'meteor/templating';

import { CoffeeMakers } from '../api/coffeeMakers';

import './coffeeMakerList.html';
import './coffeeMaker';

if (Meteor.isClient) {
  Template.coffeeMakerList.helpers({
    coffeeMakers() {
      return CoffeeMakers.find({});
    },
  });
}