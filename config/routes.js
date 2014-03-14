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
    action: 'auth_local',
    cors: true
  },
  'post /signup': {
    controller: 'UserController',
    action: 'signup',
    cors: true
  },
  'post /logout': {
    controller: 'UserController',
    action: 'logout',
    cors: true
  },
  'get /user/logged_in': {
    controller: 'UserController',
    action: 'logged_in',
    cors: true
  },

  // EVENTS

  'post /event/create': {
    controller: 'EventController',
    action: 'create'
  },
  'get /event/list/:query': {
    controller: 'EventController',
    action: 'list'
  },
  'put /event/:slug/join': {
    controller: 'EventController',
    action: 'join'
  },
  'get /event/:slug/subscribe': {
    controller: 'EventController',
    action: 'subscribe'
  },

  // PLAYLIST
  'put /playlist/:id/addSong': {
    controller: 'PlayListController',
    action: 'addSong'
  },

  // SONGS

  'get /song/search/:source/:query': {
    controller: 'SongController',
    action: 'search'    
  },
  'post /song/create/remote': {
    controller: 'SongController',
    action: 'create_remote'
  }


};


