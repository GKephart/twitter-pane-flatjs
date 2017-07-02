// define the buttons tied to the view
const refreshButton =document.querySelector('.refresh');
const closeButton1 = document.querySelector('.close1');
const closeButton2 = document.querySelector('.close2');
const closeButton3 = document.querySelector(".close3");

// map the buttons to observables (aka time to make it stream
const refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');
const close1ClickStream = Rx.Observable.fromEvent(closeButton1, 'click');
const close2ClickStream = Rx.Observable.fromEvent(closeButton2, 'click');
const close3ClickStream = Rx.Observable.fromEvent(closeButton3, 'click');


//documentation
const requestStream = refreshClickStream.startWith('startup click')
	.map(function() {
		var randomOffset = Math.floor(Math.random()*500);
		return 'https:// api.github.com/users?since=' + randomOffset;
	});

//docuentatio goes here
const responceStream = requestStream
	.flatMap(function(requestUrl) {
		return Rx.Observable.fromPromise($.getJson(requestUrl));
	});

function createSugestionStream(closeClickStream) {
	return closeClickStream.startWith('startup click ')

		.combineLatest(responceStream,
			function(click, listUsers) {
				return listUsers[Math.floor(Math.random()*listUsers.length)];
			}
		)
		.merge(
			refreshClickStream.map(function() {
				return null;
			})
		)
		.startWith(null);
}

//documentation goes here
const suggestion1Stream = createSugestionStream(close1ClickStream);
const suggestion2Stream = createSugestionStream(close2ClickStream);
const suggestion3Stream = createSugestionStream(close3ClickStream);


/**
 * rendering the view
 **/
function renderSuggetion(suggestedUser, selector) {
	//figure out how to bring ES6 into this fucking bitch
	var suggestionEl = document.querySelector(selector);
	if (suggestedUser === null) {

		suggestionEl.style.visibility = 'hidden';
	} else {

		suggestionEl.style.visibility = 'visible';

		var usernameEl = suggestionEl.querySelector(".username");
		usernameEl.herf = suggestedUser.html_url;
		usernameEl.textContent =suggestedUser.login;

		var imgEl = SuggestionEl.querySelector('img');
		imgEl.src = "";
		imgEl.src = suggestedUser.avatar_url;
	}
}

// documentation goes here
suggestion1Stream.subscribe(function(suggestedUser) {
	renderSuggetion(suggestedUser, 'suggestion1');
});
suggestion2Stream.subscribe(function(suggestedUser) {
	renderSuggetion(suggestedUser, 'suggestion2');
});
suggestion3Stream.subscribe(function(suggestedUser) {
	renderSuggetion(suggestedUser, 'suggestion3');

});


