var login_comps;

$(function () {
	login_comps = {
		button: {
			submit: $('#submit-button')
		},
		input: {
			username: $('#username-input'),
			password: $('#password-input')
		}
	};

	login_comps.button.submit.click(function() {
		do_login();
	});
});

function do_login() {
	var params = {
		username: login_comps.input.username.val(),
		password: login_comps.input.password.val()
	};
	console.log(params);
	socket.post('/login/local', params, function(res) {
		console.log(res);
	});
}