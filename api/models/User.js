/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt');

module.exports = {

	attributes: {
		username: {
			type: 'string',
			required: true
		},
		password: {
			type: 'string',
			minLength: '6',
			required: true
		},

		validPassword: function(password) {
			bcrypt.compare(password, this.password, function(err, res) {
				return res;
			});
		},
		toJSON: function() {
			var obj = this.toObject();
			delete obj.password;
			return obj;
		}
	},

	beforeCreate: function(user, next) {
	    bcrypt.hash(user.password, 10, function(err, hash) {
			if(err) return next(err);
			user.password = hash;
			next();
    });
  }

};
