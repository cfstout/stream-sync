/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that the login action in one of the controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */

 
/**
 * Allow any authenticated user
 * User can later be found in req.user in the controller
 */
module.exports = function(req, res, next) {
	// User is allowed, proceed to controller
	if (req.isAuthenticated()) {
		return next();
	} else {
		return res.send({status: 401});
	}
};