var signup_comps;

$(function () {
	signup_comps = {
		button: {
			submit: $('#submit-button')
		},
		input: {
			username: $('#username-input'),
			password: $('#password-input')
		}
	};

	signup_comps.button.submit.click(function() {
		do_signup();
	});
});

function do_signup() {
	var params = {
		username: signup_comps.input.username.val(),
		password: signup_comps.input.password.val()
	};
	console.log(params);
	$.post('/signup', params, function(res) {
		console.log(res);
	});
}