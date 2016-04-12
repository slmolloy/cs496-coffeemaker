import { Template } from 'meteor/templating';

import { CoffeeMakers } from '../api/coffeeMakers';

import './body.html';
import './newCoffeeMaker';
import './coffeeMaker.js';

Template.body.helpers({
  coffeeMakers() {
    return CoffeeMakers.find({});
  },
});