var tracks;
var curTrack;

function subscribe(playlistid) {
	socket.post('/subscribe/'+playlistid, function(res) {
		tracks = res.audio;
		curTrack = res.curTrack;
	});
}