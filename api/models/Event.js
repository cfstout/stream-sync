/**
 * Event
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
		
		name: {
			type: 'string',
			required: true 
		},
		slug: {
			type: 'string',
			required: true
		},
		memberlist: {
			type: 'string'
		},
		creator: {
			type: 'string',
			required: true
		},
		playlist: {
			type: 'string'
		},
		datetime: {
			type: 'datetime'
		},
		loc: {
			type: 'string'
		}

	},

};
