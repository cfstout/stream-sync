// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

function goTo(url, leave_history) {
	if (typeof leave_history !== 'undefined') {
		window.location.href(url);
	} else {
		window.location.replace(url);
	}
}