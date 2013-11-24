var tracks;
var curTrack;
var output_container;
var curRenderedTrack;
var track_output;
var duration;

function listen_to(playlistid, output_playlist, ouput_track) {
	output_container = output_playlist;
	track_output = ouput_track;

	socket.get('/current/'+playlistid, function(res) {
		tracks = res.audio;
		curTrack = res.curTrack;
		display_playlist();
		getCurTrack(0);
	});
	socket.on('message', function(res) {
		switch(res.model) {
			case "playlist":
				tracks.push(res.data.audio);
				display_playlist();
				break;
			default:
				alert("res.model");
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
	var host_priveledge;
	socket.post('/verifyHost', function(isHost) {
		host_priveledge = isHost;
	});
	if (host_priveledge) {
		curRenderedTrack = window.tomahkAPI.Track(tracks[curTrack].track, tracks[curTrack].artist, {
			autoplay: autoplay,
		    handlers: {
		        onended: function() {
		            nextTrack();
		        },
		        onplayable: function() {

		        },
		        onresolved: function(resolver, result) {

		        },
		        ontimeupdate: function(timeupdate) {
		            var currentTime = parseInt(timeupdate.currentTime);
		            duration = parseInt(timeupdate.duration);

		            set_seekbar(currentTime/duration);

		        }
		    }
		});
	} else {
		curRenderedTrack = window.tomahkAPI.Track(tracks[curTrack].track, tracks[curTrack].artist, {
			autoplay: autoplay,
		    handlers: {
		        onloaded: function() {

		        },
		        onended: function() {
		            
		        },
		        onplayable: function() {

		        },
		        onresolved: function(resolver, result) {

		        },
		        ontimeupdate: function(timeupdate) {
		            var currentTime = parseInt(timeupdate.currentTime);
		            duration = parseInt(timeupdate.duration);

		            set_seekbar(currentTime/duration);

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
	if (tracks.length > curTrack) {
		curTrack++;
		getCurTrack(1);
	}
}

function seekTrack(percentage) {
	socket.post('/verifyHost', function(isHost) {
		if (isHost) {
			curRenderedTrack.seek(percentage*duration);
		}
	});
}