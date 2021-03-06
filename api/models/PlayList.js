/**
 * PlayList
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
		
		event: {
			type: 'string'
		},
		songs: {
			type: 'array'
		},
		current: {
			type: 'integer',
			defaultsTo: -1
		},
		songTime: {
			type: 'float',
			defaultsTo: 0
		},
		hostTime: {
			type: 'float',
			defaultsTo: 0
		},
		isPlaying: {
			type: 'boolean',
			defaultsTo: false
		}

	}

};
