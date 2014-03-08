/**
 * Audio
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
		
		source: {
			type: 'string'
		},
		source_id: {
			type: 'string'
		},
		title: {
			type: 'string'
		},
		artist: {
			type: 'string'
		},
		duration: {
			type: 'integer'
		}

	}

};
