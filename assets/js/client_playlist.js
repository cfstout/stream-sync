var tracks;
var curTrack;
var output_container;
var curRenderedTrack;
var track_output;
var duration;
var oCurTime;
var curTime;
var counter = 0;
var playlist_id;
var isHost;

function listen_to(playlistid, output_playlist, ouput_track, hosting) {
	output_container = output_playlist;
	track_output = ouput_track;
	playlist_id = playlistid;
	isHost = hosting;

	socket.get('/current/'+playlistid, function(res) {
		tracks = res.audio;
		curTrack = res.curTrack;
		audio = tracks[curTrack];
		curTime = audio.curTime;
		oCurTime = curTime;
		if (!isHost) socket.post('/audio/sync', {audio_id: audio.id});
		display_playlist();
		getCurTrack(1);
	});

	socket.on('message', function(res) {
		switch(res.model) {
			case "audio":
				checkSync(res.data.curTime);
				break;
			case "playlist":
				if (res.data.audio) {
					tracks.push(res.data.audio);
					display_playlist();
				} else {
					socket.post('/audio/unsync', {audio_id: (tracks[curTrack]).id});
					curTrack = res.data.curTrack;
					getCurTrack(1);
				}
				break;
		}
    });
}

function display_playlist() {
  var html = '<div class="ui list">';
  if (tracks.length == 0) {
  	html += '<h5 class="error">No Songs Found. Add Some.</h5>';
  }
  for (i = 0; i < tracks.length; i++) {
    html += create_playlist_item(tracks[i]);
    html += (i < tracks.length-1) ? '<div class="ui divider"></div>' : "";
  }
  html += '</div>';
  output_container.html(html);
  playlist_ontop();
}

function create_playlist_item(item) {
  var artist_name = item.artist;
  var track_name = item.track;

  var html = '<div class="item">';
  html += '<div class="content">';
  html += '<div class="header">'+ track_name +'</div>';
  html += '<span class="artist-name">'+ artist_name +'</span>';
  html += '</div></div>';

  return html;
}

function playlist_ontop() {
	if (!output_container.transition('is visible')) {
		swap_containers();
	}
}


function getCurTrack(autoplay) {
	if (tracks.length == curTrack) {
		return 0;
	}
	if (isHost) {
		var audio_id = tracks[curTrack].id;
		curRenderedTrack = window.tomahkAPI.Track(tracks[curTrack].track, tracks[curTrack].artist, {
			autoplay: autoplay,
		    handlers: {
		        onended: function() {
		        	socket.post('/playlist/update/'+playlist_id, {curTrack: (curTrack+1)});
		            nextTrack();
		        },
		        ontimeupdate: function(timeupdate) {
		        	oCurTime = curTime;
		            curTime = parseInt(timeupdate.currentTime);
		            if (oCurTime != curTime) {
		            	// alert(tracks[curTrack].id);
		            	socket.post('/audio/update', {audio_id: audio_id, curTime: curTime});
		            }
		            duration = parseInt(timeupdate.duration);
		            set_seekbar(curTime/duration);
		        }
		    }
		});
	} else {
		curRenderedTrack = window.tomahkAPI.Track(tracks[curTrack].track, tracks[curTrack].artist, {
			autoplay: autoplay,
		    handlers: {	
		        ontimeupdate: function(timeupdate) {
		        	counter++;
		        	oCurTime = curTime;
		            curTime = parseInt(timeupdate.currentTime);
		            if (oCurTime != curTime) {
		            	counter = 0;
		            }
		            duration = parseInt(timeupdate.duration);
		            set_seekbar(curTime/duration);

		        }
		    }
		});
	}
	track_output.html(curRenderedTrack.render());
}

function playTrack() {
	curRenderedTrack.play();
}

function nextTrack() {
	// if (isHost) socket.post('/playlist/update/'+playlist_id, {curTrack: (curTrack+1)});
	if (tracks.length > curTrack) {
		curTrack++;
		getCurTrack(1);
	}
}

function seekTrack(percentage) {
	if (isHost) {
		curRenderedTrack.seek(percentage*duration);
	}
}

function checkSync(time) {
	if (Math.abs((time*20) - (curTime*20+counter)) > 2) {
		curRenderedTrack.seek(time);
		playTrack();
		setTimeout('playTrack()', 1000);
	}
}