/**
 * Routes
 *
 * Sails uses a number of different strategies to route requests.
 * Here they are top-to-bottom, in order of precedence.
 *
 * For more information on routes, check out:
 * http://sailsjs.org/#documentation
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


