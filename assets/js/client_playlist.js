var tracks;
var curTrack;
var output_container;
var curRenderedTrack;
var nextRenderedTrack;

function listen_to(playlistid, output_playlist) {
	output_container = output_playlist;
	socket.get('/current/'+playlistid, function(res) {
		tracks = res.audio;
		curTrack = res.curTrack;
		display_playlist();
		getCurTrack($('#track'));
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


function getCurTrack(output) {
	if (tracks.length == curTrack) {
		return 0;
	}
	curRenderedTrack track = window.tomahkAPI.Track(tracks[curTrack].track, tracks[curTrack].artist, {
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
	            
	        }
	    }
	});
	output.html(track.render());
}

function playTrack() {
	curRenderedTrack.play();
}