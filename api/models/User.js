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
		loc: {
			type: 'string',
			required: true
		},
		event: {
			type: 'string',
			defaultsTo: ''
		},
		/* checks to see if a password matches the stored hash */
		validPassword: function(password) {
			return bcrypt.compareSync(password, this.password);
		},
		/* removes password from object before returning it to user */
		toJSON: function() {
			var obj = this.toObject();
			delete obj.password;
			return obj;
		}
	},
	/* hashes password before being saved in database */
	beforeCreate: function(user, next) {
		bcrypt.hash(user.password, 10, function(err, hash) {
			if(err) return next(err);
			user.password = hash;
			next();
		});
	}

};
