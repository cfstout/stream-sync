/**
 * Routes
 *
 * Routes different requests to the server to 
 * Controller actions and views
 */

module.exports.routes = {

  // VIEWS

  // directs to angular loader
  'get /': {
    view: 'index'
  },
  // gets templates
  'get /views/:folder/:view': {
    controller: 'ViewController'
  },

  // AUTHENTICATION

  'post /login/local': {
    controller: 'UserController',
    action: 'auth_local'
  },
  'post /signup': {
    controller: 'UserController',
    action: 'signup'
  },
  'post /logout': {
    controller: 'UserController',
    action: 'logout'
  },

  // EVENTS

  'post /event/create': {
    controller: 'EventController',
    action: 'create'
  },


};


