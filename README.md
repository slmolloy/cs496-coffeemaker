# cs496-coffeemaker
Coffee maker web app

Website available at: https://tranquil-lowlands-46896.herokuapp.com/

API available at:  https://tranquil-lowlands-46896.herokuapp.com/api/v1

### To run locally
Clone repository and run the following:
```
curl https://install.meteor.com/ | sh
meteor npm install
meteor
```
Site will run at http://localhost:3000.

### To run tests
```
npm test
```
Server will log to console and final results will be displayed on screen.
Test will monitor for file changes and re-run tests on file changes, Ctrl+C to
finish tests.

Test website is running at http://localhost:4000

Can also run tests with:
```
meteor test --driver-package practicalmeteor:mocha --port 4000
```
Test code is currently hard coded to look for port 4000.
