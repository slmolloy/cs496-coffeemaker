import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './coffeeMaker.html';

Template.coffeeMaker.events({
  'click .delete'() {
    console.log("Clicked delete");
    Meteor.call('coffeeMakers.remove', this._id);
  },
});