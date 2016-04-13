import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './coffeeMaker.html';

if (Meteor.isClient) {
  Template.coffeeMaker.onCreated(function bodyOnCreated() {

  });

  Template.coffeeMaker.helpers({
    editing() {
      return Session.equals('editItemId', this._id);
    },
    isHome() {
      if (this.location === 'home') {
        return true;
      } else {
        return false;
      }
    },
    isOffice() {
      if (this.location === 'office') {
        return true;
      } else {
        return false;
      }
    },
    isOther() {
      if (this.location === 'other') {
        return true;
      } else {
        return false;
      }
    },
  });

  Template.coffeeMaker.events({
    'click .edit'() {
      if (Session.get('editItemId') !== null) {
        alert("Save or cancel existing changes");
        return;
      }
      Session.set('editItemId', this._id);
    },
    'click .cancel'() {
      Session.set('editItemId', null);
    },
    'submit .editCoffeeMaker'(event) {
      event.preventDefault();

      const target = event.target;
      const name = target.name.value;
      const url = target.url.value;
      const location = target.location.value;
      const volume = target.volume.value;
      const isPrivate = target.private.checked;

      Session.set('editItemId', null);
      Meteor.call('coffeeMakers.update', this._id, name, url, location, volume, isPrivate);
    },
    'click .delete'() {
      console.log("Clicked delete");
      Meteor.call('coffeeMakers.remove', this._id);
    },
  });
}