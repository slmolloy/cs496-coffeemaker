import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../api/coffeeMakers';
import './coffeeMakerList.html';
import './coffeeMaker';

if (Meteor.isClient) {
  Template.coffeeMakerList.helpers({
    coffeeMakers() {
      Meteor.call('coffeeMakers.get', 0, 10, function(error, result) {
        Session.set("data", result);
      });
      if (Session.get("data")) {
        return Session.get("data");
      } else {
        return [];
      }
    },
  });
}