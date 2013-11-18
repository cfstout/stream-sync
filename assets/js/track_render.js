var tracks = [];

function render_track(artist_name, song_name, output) {
	var track = window.tomahkAPI.Track(song_name, artist_name, {
		handlers: {
			onplayable: function() {
				var html = '<button onclick="play_track('+(tracks.length-1)+')">'+song_name+'</button>';
				output.append(html);
			}
		}
	});
	tracks.push(track);
	output.html(track.render());
}

function play_track(track_num) {
	tracks[track_num].play();
}

function pause_track(track_num) {
	tracks[track_num].pause();
}