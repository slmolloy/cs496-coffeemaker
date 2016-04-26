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
  },
  'recordNotFoundError': function(message) {
    check(message, String);

    return {
      statusCode: 400,
      header: {
        'Content-Type': 'application/json'
      },
      body: {
        'error': 'record-not-found-error',
        'msg': message
      }
    }
  },
  'documentNotFoundError': function(message) {
    check(message, String);

    return {
      statusCode: 400,
      header: {
        'Content-Type': 'application/json'
      },
      body: {
        'error': 'document-not-found-error',
        'msg': message
      }
    }
  },
  'recordCreated': function(newRecord) {
    return {
      statusCode: 200,
      header: {
        'Content-Type': 'application/json'
      },
      body: newRecord
    }
  },
  'recordDeleted': function(route, id) {
    check(route, String);
    check(id, String);

    return {
      statusCode: 200,
      header: {
        'Content-Type': 'application/json'
      },
      body: {
        'action': 'delete',
        'route': route,
        'id': id
      }
    }
  },
  'arrayItemDeleted': function(route, id, item, action) {
    check(route, String);
    check(id, String);
    check(item, String);

    return {
      statusCode: 200,
      header: {
        'Content-type': 'application/json'
      },
      body: {
        'action': 'array-delete',
        'route': route,
        'itemId': item,
        'action': action
      }
    }
  }
});