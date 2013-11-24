var timer;
var typingDelay = 750;
var query;
var output_container;
var playlist;

function poll_search(input, output, playlist_id) {
  playlist = playlist_id;
  output_container = output;
  $(input).keyup(function() {
    clearTimeout(timer);
    query = input.val();
    timer = setTimeout('post_search()', typingDelay);
    style_container();
    add_loader();
  });
}

function post_search() {
  socket.post('/search', {query: query}, function(res) {
    if (res.resultCount == 0) { output_container.html('<h5 class="error">No Results Found.</h5>'); }
    else { display_results(res.results); }
  });
}

function display_results(results) {
  var html = '<div class="ui list">';
  for (i = 0; i < results.length; i++) {
    html += create_result_item(results[i]);
    html += (i < results.length-1) ? '<div class="ui divider"></div>' : "";
  }
  html += '</div>';
  output_container.html(html);
}

function create_result_item(result) {
  var artist_name = result.artistName;
  var track_name = result.trackName
  var album_img_sm = result.artworkUrl60;
  var album_name = result.collectionName;

  var html = '<a class="item" onclick="'+ 
    'check_stream(\''+ artist_name.replace(/'/g, "\\'") +'\', \''+ track_name.replace(/'/g, "\\'") +'\');">';
  html += '<img class="ui image rounded right floated album-image" src="'+ album_img_sm +'">';
  html += '<div class="content">';
  html += '<div class="header">'+ track_name +'</div>';
  html += '<span class="artist-name">'+ artist_name +'</span>&#09;';
  html += '<span class="album-name">'+ album_name +'</span>';
  html += '</div></a>';

  return html;
}

function style_container() {
  if (!output_container.hasClass("segment")) {
    output_container.addClass("ui");
    output_container.addClass("segment");
  }
  if (!output_container.transition('is visible')) {
    swap_containers();
  }
}

function add_loader() {
  output_container.html('<div class="ui active loader"></div>');
}

function check_stream(artist_name, track_name) {
  $('#checking_dimmer .content .center').html('<h2 class="ui text loader">Checking Music Availability</h2>');
  $('#checking_dimmer').addClass('checking');
  $('#checking_dimmer').dimmer({'closable': false}).dimmer('toggle');
  var tmout = setTimeout('rejected_stream()', 10000);
  var track = window.tomahkAPI.Track(track_name, artist_name, {
      handlers: {
          onresolved: function(resolver, result) {
              if ($('#checking_dimmer').hasClass('checking')) {
                clearTimeout(tmout);
                verified_stream(artist_name, track_name);
              }
          }
      }
  });
  $('#track_checker').html(track.render());
}

function verified_stream(artist_name, track_name) {
  $('#checking_dimmer').removeClass('checking');
  $('#checking_dimmer .content .center').html('<h2 class="ui inverted icon header"><i class="icon smile"></i>It Fucking Worked!</h2>');
  $('#checking_dimmer').dimmer({'closable': true});
  socket.post('/addsong/'+playlist, {artist: artist_name, track: track_name});
  $('#track_checker').html().remove();
}

function rejected_stream() {
  $('#checking_dimmer').removeClass('checking');
  $('#checking_dimmer .content .center').html('<h2 class="ui inverted icon header"><i class="icon frown"></i>It Didn\'t Work!</h2>');
  $('#checking_dimmer').dimmer({'closable': true});
}