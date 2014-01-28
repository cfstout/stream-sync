/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */

 
/**
 * Allow any authenticated user.
 */
module.exports = function(req, res, next) {
	// User is allowed, proceed to controller
	if (req.isAuthenticated()) {
		return next();
	} else {
		return res.send({status: 401});
	}
};