function move_seekbar(outer, inner) {
	outer.click( function(e) {
		var pixel_width = e.pageX - $(this).offset().left;
		var percentage = pixel_width / $(this).width();
		inner.css("width", (percentage*100)+"%");
	});
}