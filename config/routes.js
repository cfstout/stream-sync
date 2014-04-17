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
  'get /user/logged_in': {
    controller: 'UserController',
    action: 'logged_in'
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
  'post /event/:slug/subscribe': {
    controller: 'EventController',
    action: 'subscribe'
  },
  'delete /event/:id/delete': {
    controller: 'EventController',
    action: 'delete'
  },


  // PLAYLIST
  'put /playlist/:id/addSong': {
    controller: 'PlayListController',
    action: 'addSong'
  },
  'post /playlist/:id/sync': {
    controller: 'PlayListController',
    action: 'sync'
  },
  'get /playlist/:id/getSongs': {
    controller: 'PlayListController',
    action: 'getSongs'
  },

  // SONGS

  'get /song/search/:source/:query': {
    controller: 'SongController',
    action: 'search'    
  },
  'post /song/create/remote': {
    controller: 'SongController',
    action: 'create_remote'
  },

  // MISC

  'post /ntp/sync': {
    controller: 'NtpController',
    action: 'sync'
  }


};


