import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
  'badOperation': function(message) {
    check(message, String);

    return {
      statusCode: 400,
      header: {
        'Content-Type': 'application/json'
      },
      body: {
        'error': 'bad-operation',
        'msg': message
      }
    }
  },
  'unknownError': function(message) {
    check(message, String);

    return {
      statusCode: 400,
      header: {
        'Content-Type': 'application/json'
      },
      body: {
        'error': 'unknown-error',
        'msg': message
      }
    }
  },
  'validationError': function(message) {
    check(message, String);
    
    return {
      statusCode: 400,
      header: {
        'Content-Type': 'application/json'
      },
      body: {
        'error': 'validation-error',
        'msg': message
      }
    }
  }
});