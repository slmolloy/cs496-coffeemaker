import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './newCoffeeMaker.html';

var resetForm = function(event) {
  const target = event.target;

  target.name.value = '';
  target.url.value = '';
  for (let radio of target.location) {
    radio.checked = false;
  }
  target.volume.value = '';
  target.private.checked = false;
};

Template.body.events({
  'submit .newCoffeeMaker'(event) {
    event.preventDefault();

    const target = event.target;
    const name = target.name.value;
    const url = target.url.value;
    const location = target.location.value;
    const volume = target.volume.value;
    const isPrivate = target.private.checked;
    
    Meteor.call('coffeeMakers.insert', name, url, location, volume, isPrivate);
    
    resetForm(event);
  },
  'reset .newCoffeeMaker'(event) {
    event.preventDefault();
    resetForm(event);
  },
});