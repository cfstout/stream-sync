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
		host: {
			type: 'string'
		},
		playList: {
			type: 'string'
		}

	},

	beforeCreate: function(event, next) {
		PlayList.create({
			event: event,
			songs: []
		}).done(function(err, playList) {
			if (!playList) {
				err = err+ " WTF";
			}
			if (err) {
				return next(err);
			}
			event.playList = playList;
		});

		MemberList.create({
			event: event,
			members: {},
			host: event.host
		}).done(function(err, memberList) {
			if (!memberList) {
				err = err+ " WTF";
			}
			if (err) {
				return next(err);
			}
			event.memberList = memberList;
		});
		return next();
	}

};
