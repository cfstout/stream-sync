/**
 * Policy mappings (ACL)
 *
 * Policies are simply Express middleware functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect just one of its actions.
 *
 * True for all routes right now but will be updated in the future with the authentication policies
 * located in the api folder.
 */


module.exports.policies = {

  // Default policy for all controllers and actions
  // (`true` allows public access) 
  '*': true,

  UserController: {
  	logged_in: 'isAuthenticated'
  },
  EventController: {
  	get_events_by_creator: 'isAuthenticated',
    create:'isAuthenticated',
    list: 'isAuthenticated',
    join: 'isAuthenticated'
  }
  
};

