import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { assert } from 'meteor/practicalmeteor:chai';

import { CoffeeMakers } from './coffeeMakers';
import '../api/coffeeMakers';
import './users';

const URL = 'http://localhost:4000/api/v1/makers';
const URL_USERS = 'http://localhost:4000/api/v1/users';

if (Meteor.isServer) {
  describe('CoffeeMakers', () => {
    describe('api', () => {
      const name = 'Office Space';
      const location = 'office';
      const volume = 12;
      const isPrivate = false;

      const userName = 'Derek';
      const userEmail = 'derek@coffee.com';

      const permissions = [ 'owner', 'user' ];

      beforeEach(() => {
        Meteor.call('coffeeMakers.removeAll');
        Meteor.users.remove({});
      });

      afterEach(() => {
        Meteor.call('coffeeMakers.removeAll');
        Meteor.users.remove({});
      });

      it('can create coffeeMaker', () => {
        var postResp = HTTP.post(URL, {data: {name, location, volume, isPrivate}});
        var json = postResp.data;
        assert.equal(json.name, name, 'name not equals');
        assert.equal(json.location, location, 'location not equal');
        assert.equal(json.volume, volume, 'volume not equal');
        assert.equal(json.isPrivate, isPrivate, 'private flag not equal');
        assert.isFalse(json.on, 'expected default false');
        assert.equal(json.currentVolume, 0, 'expected default 0');
        assert.notEqual(json.createdAt, undefined, 'expected createdAt to be set');
        assert.notEqual(json.token, undefined, 'expected token to be set');
      });

      it('fail to create invalid coffeeMaker', () => {
        var postResp = 0;
        var response = 0;
        try {
          postResp = HTTP.post(URL, {data: {name: name}});
        } catch (exception) {
          response = exception.response;
        }
        assert.equal(postResp, 0, 'expecting result to be 0');
        assert.equal(response.statusCode, 400, 'expecting failed post');
        assert.equal(response.data.error, 'unknown-error', 'failed with unknown error');
      });

      it('can update existing coffeeMaker', () => {
        var postResp = HTTP.post(URL, {data: {name, location, volume, isPrivate}});
        var coffeeMakerId = postResp.data._id;
        var createdAt = postResp.data.createdAt;
        var token = postResp.data.token;

        var newVolume = 24;

        var putResp = HTTP.put(URL + '/' + coffeeMakerId, {data: {volume: newVolume}});
        var json = putResp.data;
        assert.equal(putResp.statusCode, 200, 'expecting successful put');
        assert.equal(json._id, coffeeMakerId, 'expecting same coffeeMakerId');
        assert.equal(json.name, name, 'expecting same name');
        assert.equal(json.location, location, 'expecting same location');
        assert.equal(json.volume, newVolume, 'expecting new volume');
        assert.equal(json.isPrivate, isPrivate, 'expecting same private flag');
        assert.isFalse(json.on, 'expecting same on flag');
        assert.equal(json.createdAt, createdAt, 'expected same creation time');
        assert.equal(json.token, token, 'expected same token');
      });

      it('can delete existing coffeeMaker', () => {
        var postResp = HTTP.post(URL, {data: {name, location, volume, isPrivate}});
        var coffeeMakerId = postResp.data._id;

        var delResp = HTTP.del(URL + '/' + coffeeMakerId);
        var json = delResp.data;
        assert.equal(delResp.statusCode, 200, 'expecting successful delete');
        assert.equal(json.action, 'delete', 'expecting delete action');
        assert.equal(json.route, 'makers/:id', 'expecting makers/id route');
        assert.equal(json.id, coffeeMakerId, 'expecting coffeeMakerId to match');
      });

      it('can add user to coffeeMaker', () => {
        var makerResp = HTTP.post(URL, {data: {name, location, volume, isPrivate}});
        var coffeeMakerId = makerResp.data._id;

        var userResp = HTTP.post(URL_USERS, {data: {name: userName, email: userEmail}});
        var userId = userResp.data._id;

        var postResp = HTTP.post(URL + '/' + coffeeMakerId + '/users',
          {data: {id: coffeeMakerId, userId: userId, permissions}});
        assert.equal(postResp.data, 1, '1 record updated');

        makerResp = HTTP.get(URL + '/' + coffeeMakerId);
        var json = makerResp.data;
        console.log('RESPONSE: ' + json);
        console.log(json.users[0]);
        assert.equal(json.users.length, 1, 'users array contains 1 item');
        assert.equal(json.users[0].id, userId, 'expecting same userId');
        assert.equal(json.users[0].name, userName, 'expecting same user name');
        assert.equal(json.users[0].permissions.length, permissions.length, 'expecting same number of permissions');
        assert.deepEqual(json.users[0].permissions, permissions, 'expecting same permissions list');
      });

      it('can remove user from coffeeMaker', () => {
        var makerResp = HTTP.post(URL, {data: {name, location, volume, isPrivate}});
        var coffeeMakerId = makerResp.data._id;

        var userResp = HTTP.post(URL_USERS, {data: {name: userName, email: userEmail}});
        var userId = userResp.data._id;

        var postResp = HTTP.post(URL + '/' + coffeeMakerId + '/users',
          {data: {id: coffeeMakerId, userId: userId, permissions}});
        assert.equal(postResp.data, 1, '1 record updated');

        makerResp = HTTP.get(URL + '/' + coffeeMakerId);
        var json = makerResp.data;
        assert.equal(json.users.length, 1, 'users array contains 1 item');
        assert.equal(json.users[0].id, userId, 'expecting same userId');
        assert.equal(json.users[0].name, userName, 'expecting same user name');
        assert.equal(json.users[0].permissions.length, permissions.length, 'expecting same number of permissions');
        assert.deepEqual(json.users[0].permissions, permissions, 'expecting same permissions list');

        var delResp = HTTP.del(URL + '/' + coffeeMakerId + '/users/' + userId);
        var json = delResp.data;
        assert.equal(delResp.statusCode, 200, 'expecting successful delete');
        assert.equal(json.action, 'removeUser', 'expecting removeUser action');
        assert.equal(json.route, 'makers/:id/users/:userId', 'expecting maker/id/users/id route');
        assert.equal(json.itemId, userId, 'expecting item id remove to match userId');
      });

      it('can cleanup user permissions on user delete', () => {
        var makerResp = HTTP.post(URL, {data: {name, location, volume, isPrivate}});
        var coffeeMakerId = makerResp.data._id;

        var userResp = HTTP.post(URL_USERS, {data: {name: userName, email: userEmail}});
        var userId = userResp.data._id;

        var postResp = HTTP.post(URL + '/' + coffeeMakerId + '/users',
          {data: {id: coffeeMakerId, userId: userId, permissions}});
        assert.equal(postResp.data, 1, '1 record updated');

        makerResp = HTTP.get(URL + '/' + coffeeMakerId);
        var json = makerResp.data;
        assert.equal(json.users.length, 1, 'users array contains 1 item');
        assert.equal(json.users[0].id, userId, 'expecting same userId');
        assert.equal(json.users[0].name, userName, 'expecting same user name');
        assert.equal(json.users[0].permissions.length, permissions.length, 'expecting same number of permissions');
        assert.deepEqual(json.users[0].permissions, permissions, 'expecting same permissions list');

        var delResp = HTTP.del(URL_USERS + '/' + userId);
        var json = delResp.data;
        assert.equal(delResp.statusCode, 200, 'expecting successful delete');
        assert.equal(json.action, 'delete', 'expecting delete action');
        assert.equal(json.route, 'users/:id', 'expecting user/id route');
        assert.equal(json.id, userId, 'expecting userId to match');

        makerResp = HTTP.get(URL + '/' + coffeeMakerId);
        var json = makerResp.data;
        assert.equal(json.users.length, 0, 'users array contains 0 item');
      });
    });
  });
}
