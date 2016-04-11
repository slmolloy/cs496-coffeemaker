import { Template } from 'meteor/templating';

import { CoffeeMakers } from '../api/coffeeMakers';

import './body.html';
import './newCoffeeMaker';
import './coffeeMaker.js';

Template.body.helpers({
  coffeeMakers() {
    return CoffeeMakers.find({});
  },
  // coffeeMakers: [
  //   {
  //     name: 'Wake me up',
  //     location: 'home',
  //     volume: 12,
  //     on: false,
  //     lastOn: new Date(),
  //     lastOff: new Date()
  //   },
  //   {
  //     name: 'Go team go!',
  //     location: 'office',
  //     volume: 12,
  //     on: false,
  //     lastOn: new Date(),
  //     lastOff: new Date()
  //   }
  // ],
});