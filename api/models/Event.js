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
			type: 'string'
		},
		memberList: {
			type: 'string'
		},
		creator: {
			type: 'string'
		},
		playList: {
			type: 'string'
		},
		time: {
			type: 'time'
		},
		date: {
			type: 'date'
		},
		loc: {
			type: 'string'
		}

	},

};
