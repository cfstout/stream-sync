var outer_box;
var inner_box;

function move_seekbar(outer, inner) {
	outer_box = outer;
	inner_box = inner;
	outer_box.click( function(e) {
		var pixel_width = e.pageX - $(this).offset().left;
		var percentage = pixel_width / $(this).width();
		inner_box.css("width", (percentage*100)+"%");
		seekTrack(percentage);
	});
}

function set_seekbar(percentage) {
	inner_box.css("width", (percentage*100)+"%");
}