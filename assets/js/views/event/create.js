var create_comps;

$(function() {
	create_comps = {
		input: {
			event_name: $('#event-name-input')
		},
		button: {
			submit: $('#create-button')
		}
	};

	create_comps.button.submit.click(function() {
		create_event();
	});
});

function create_event() {
	var params = {
		name: create_comps.input.event_name.val()
	};
	$.post('/event/create', params, function(res) {
		console.log(res);
	});
}