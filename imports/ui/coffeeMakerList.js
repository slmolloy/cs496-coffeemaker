import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import '../api/coffeeMakers';
import './coffeeMakerList.html';
import './coffeeMaker';

if (Meteor.isClient) {
  Template.body.onCreated(function() {
    Session.set('mine', false);
  });

  Template.coffeeMakerList.helpers({
    coffeeMakers() {
      Meteor.call('coffeeMakers.get', {mine: Session.get('mine')}, function(error, result) {
        Session.set("data", result);
      });
      if (Session.get("data")) {
        return Session.get("data");
      } else {
        return [];
      }
    },
    mineChecked() {
      return Session.get('mine');
    }
  });

  Template.coffeeMakerList.events({
    'click .showMine'(event) {
      Session.set('editItemId', null);
      if (event.target.checked) {
        Session.set('mine', true);
      } else {
        Session.set('mine', false);
      }
    },
  })
}