import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { assert } from 'meteor/practicalmeteor:chai';

import './users';
import '../api/users';

const URL = 'http://localhost:4000/api/v1/users';

if (Meteor.isServer) {
  describe('Users', () => {
    describe('api', () => {
      const name = 'Derek';
      const email = 'derek@coffee.com';

      beforeEach(() => {
        Meteor.users.remove({});
      });

      afterEach(() => {
        Meteor.users.remove({});
      });

      it('can create user', () => {
        var postResp = HTTP.post(URL, {data: {name, email}});
        var json = postResp.data;
        assert.equal(json.name, name, 'name not equals');
        assert.equal(json.email, email, 'email not equal');
      });

      it('fail to create invalid user', () => {
        var postResp = 0;
        var response = 0;
        try {
          postResp = HTTP.post(URL, {data: {name}});
        } catch (exception) {
          response = exception.response;
        }
        assert.equal(postResp, 0, 'expecting result to be 0');
        assert.equal(response.statusCode, 400, 'expecting failed post');
        assert.equal(response.data.error, 'unknown-error', 'failed with unknown error');
      });

      it('can update existing user', () => {
        var postResp = HTTP.post(URL, {data: {name, email}});
        var userId = postResp.data._id;
        
        var newEmail = 'derek@brewtown.com';

        var putResp = HTTP.put(URL + '/' + userId, {data: {email: newEmail}});
        var json = putResp.data;
        assert.equal(putResp.statusCode, 200, 'expecting successful put');
        assert.equal(json._id, userId, 'expecting same userId');
        assert.equal(json.name, name, 'expecting same name');
        assert.equal(json.email, newEmail, 'expecting new email');
      });

      it('can delete existing user', () => {
        var postResp = HTTP.post(URL, {data: {name, email}});
        var userId = postResp.data._id;

        var delResp = HTTP.del(URL + '/' + userId);
        var json = delResp.data;
        assert.equal(delResp.statusCode, 200, 'expecting successful delete');
        assert.equal(json.action, 'delete', 'expecting delete action');
        assert.equal(json.route, 'users/:id', 'expecting user/id route');
        assert.equal(json.id, userId, 'expecting userId to match');
      });
    });
  });
}
