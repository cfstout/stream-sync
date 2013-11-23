var timer;
var typingDelay = 750;
var query;
var output_container;
var click_func;

function poll_search(input, output, success) {
  click_func = click_func_name;
  output_container = output;
  success_ouput = success;
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
  var album_img_lg = result.artworkUrl100;
  var album_name = result.collectionName;

  var html = '<a class="item" onclick="'+ 
    'check_stream(\''+ artist_name.replace(/'/g, "\\'") +'\', \''+ track_name.replace(/'/g, "\\'") +'\', \''+ album_img_lg +'\');">';
  // var html = '<a class="item">';
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
}

function add_loader() {
  output_container.html('<div class="ui active loader"></div>');
}

function 
