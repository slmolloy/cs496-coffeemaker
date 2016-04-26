import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { assert } from 'meteor/practicalmeteor:chai';

import { Users } from './users.js';
import '../api/users.js';

const URL = 'http://localhost:4000/api/v1/users';

if (Meteor.isServer) {
  describe('Users', () => {
    describe('api', () => {
      const name = 'Derek';
      const email = 'derek@coffee.com';

      let userId;

      beforeEach(() => {
        Meteor.users.remove({});
      });

      it('can create user', () => {
        var result = HTTP.post(URL, {data: {name: 'Scott', email: 'scott@coffee.com'}});
        var json = result.data;
        assert.equal(json.name, 'Scott', 'name not equals');
        assert.equal(json.email, 'scott@coffee.com', 'email not equal');
      });

      it('fail to create invalid user', () => {
        console.log("posting");
        var result = 0;
        var response = 0;
        try {
          result = HTTP.post(URL, {data: {name: 'Scott'}});
        } catch (exception) {
          response = exception.response;
        }
        assert.equal(result, 0, 'expecting result to be 0');
        assert.equal(response.statusCode, 400, 'expecting failed post');
        assert.equal(response.data.error, 'unknown-error', 'failed with unknown error');
      });

      it('can update existing user', () => {
        
      });
    });
  });
}
