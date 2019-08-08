let questions //to store the questions
let synth = window.speechSynthesis; // Object for speech synthesis

/* Set the score key in local storage to 0 */
$(document).ready(() => {
	text = "Let's get started. Click begin to start the quiz"
	play(text)
	localStorage.setItem('score', 0)
})

/* Get questions from backend */
function getQuestions() {
	$.ajax({
		url: 'getQuestions',
		method: 'get',
		data : {
			category : getCategory
		},
		beforeSend: function () {
			$('#loading').show();
		},
		complete: function () {
			$('#loading').hide();
		},
		success: (res) => {
			questions = res
			i = 0
			for (question of res) {
				let fieldset = '<fieldset class="field' + i + '" ><h3 class="question" id="' + question.Qid + '">' + question.Question + '' +
					'</h3><div class="row"><div class="options col-md-12"><p><label><input name="' + question.Qid + '" type="radio" value="op1"' +
					'/><span>' + question.op1 + '</span></label></p></div></div><div class="row"><div class="options col-md-12"><p><label><input name="' + question.Qid + '" type="radio" value="op2"' +
					'/><span>' + question.op2 + '</span></label></p></div></div><div class="row"><div class="options col-md-12"><p><label><input name="' + question.Qid + '" type="radio" value="op3"' +
					'/><span>' + question.op3 + '</span></label></p></div></div><div class="row"><div class="options col-md-12"><p><label><input name="' + question.Qid + '" type="radio" value="op4"' +
					'/><span>' + question.op4 + '</span></label></p></div></div><input type="button" name="next" class="next action-button" value="Next" onclick="checkAns(' + question.Qid + ',' + i + ')" /></fieldset>'
				let html = $.parseHTML(fieldset)
				$('#msform').append(html)
				i++
			}
			$('#start').fadeOut()
			$('#questionContainer').fadeIn()
			startTimer()
			const text = formQuestionText(0)
			play(text)
		}
	})
}

/* Converts and plays the text
@Param text : Text to be converted into speech and played
*/
function play(text) {
	synth.cancel()
	let utterThis = new SpeechSynthesisUtterance(text);
	utterThis.voice = synth.getVoices()[1]
	utterThis.pitch = 1
	utterThis.rate = 1
	synth.speak(utterThis)
}

/* Helper function to format the question into text
@Param i : index of the question

@return text : formatted text
*/
function formQuestionText(i) {
	const text = questions[i].Question +
		'A. ' + questions[i].op1 + '. ' +
		'B. ' + questions[i].op2 + '. ' +
		'C. ' + questions[i].op3 + '. ' +
		'D. ' + questions[i].op4
	return text
}

/* Check selected answer to be true from backend
@Param id : Question-id
@Param i : Index of fieldset
*/
function checkAns(id, i) {
	let cat = getCategory
	$.ajax({
		url: 'checkAns',
		method: 'post',
		data: {
			qid: id,
			answer: $("input[name=" + id + "]:checked").val(),
			category: cat
		},
		beforeSend: function () {
			$('#loading').show();
		},
		complete: function () {
			$('#loading').hide();
		},
		success: (res) => {
			if (res) {
				let score = parseInt(localStorage.getItem('score')) + 5
				localStorage.setItem('score', score)
				let current_fs, next_fs //fieldsets
				let left, opacity, scale //fieldset properties which we will animate
				let animating //flag to prevent quick multi-click glitches
				if (animating) return false;
				animating = true;
				current_fs = $('.field' + i)
				i += 1
				next_fs = $('.field' + i)
				console.log("first" + current_fs)
				console.log("second" + next_fs)
				//activate next step on progressbar using the index of next_fs
				$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

				//show the next fieldset
				next_fs.show();
				//hide the current fieldset with style
				current_fs.animate({ opacity: 0 }, {
					step: function (now, mx) {
						//as the opacity of current_fs reduces to 0 - stored in "now"
						//1. scale current_fs down to 80%
						scale = 1 - (1 - now) * 0.2;
						//2. bring next_fs from the right(50%)
						left = (now * 50) + "%";
						//3. increase opacity of next_fs to 1 as it moves in
						opacity = 1 - now;
						current_fs.css({
							'transform': 'scale(' + scale + ')',
							'position': 'absolute'
						});
						next_fs.css({ 'left': left, 'opacity': opacity });
					},
					duration: 800,
					complete: function () {
						current_fs.hide();
						animating = false;
					},
					//this comes from the custom easing plugin
					easing: 'easeInOutBack'
				});
				const text = formQuestionText(i)
				play(text)
			}
			else {
				submit()
			}
		}
	})
}

/* To get the category
@return category : category of question selected
*/
function getCategory() {
	let category
	if (window.location.href.endsWith('csit')) {
		category = "csit"
	} else if (window.location.href.endsWith('currAff')) {
		category = "currAff"
	} else if (window.location.href.endsWith('sports')) {
		category = "sports"
	} else if (window.location.href.endsWith('entertainment')) {
		category = "entertainment"
	}
	return category
}

/* Sends the final score to the backend */
function submit() {
	text = "PLease hold on. Submitting your final score. Thank You"
	play(text)
	if (window.location.href.endsWith('csit')) {
		cat = "csit"
	} else if (window.location.href.endsWith('currAff')) {
		cat = "currAff"
	} else if (window.location.href.endsWith('sports')) {
		cat = "sports"
	} else if (window.location.href.endsWith('entertainment')) {
		cat = "entertainment"
	}
	$.ajax({
		url: 'submitScore',
		method: 'post',
		data: {
			score: localStorage.getItem('score'),
			category: cat
		},
		beforeSend: function () {
			$('#loading').show();
		},
		complete: function () {
			$('#loading').hide();
		},
		success: (res) => {
			if (res) {
				toastr.options.onShown = function () { $('#loading').show(); }
				toastr.options.onHidden = function () {
					$('#loading').hide();
					localStorage.clear()
					window.location.href = 'dashboard'
				}
				toastr["success"]("Your Score is: " + localStorage.getItem('score'))
			} else {
				toastr["error"]("Something Went Wrong")
				window.location.href = 'dashboard'
			}
		}
	})
}

/* Initializes and start the timer */
function startTimer() {
	let time_in_minutes = 2;
	let current_time = Date.parse(new Date());
	let deadline = new Date(current_time + time_in_minutes * 60 * 1000);
	runTimer('clockdiv', deadline);
}

/* Calculates the remaining time
@Param endtime : Time at which the timer stops

@return seconds : Seconds at which the timer will stop
@return minutes : Minutes at which the timer will stop 
*/
function timeRemaining(endtime) {
	let t = Date.parse(endtime) - Date.parse(new Date());
	let seconds = Math.floor((t / 1000) % 60);
	let minutes = Math.floor((t / 1000 / 60) % 60);
	return { seconds, minutes };
}

/* Runs timer
@Param id : id of the element containing the timer
@Param endtime : Time at which the timer stops
*/
function runTimer(id, endtime) {
	let clock = document.getElementById(id);
	function updateClock() {
		let t = timeRemaining(endtime);
		clock.innerHTML = "Time  " + t.minutes + ":" + t.seconds;
		if (t.minutes == 0 & t.seconds == 0) { clearInterval(timeinterval); submit(); }
	}
	updateClock(); // run function once at first to avoid delay
	let timeinterval = setInterval(updateClock, 1000);
}