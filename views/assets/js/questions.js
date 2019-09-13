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
		method: 'post',
		data: {
			role: 'candidate'
		},
		beforeSend: function () {
			$('#loading').show();
		},
		complete: function () {
			$('#loading').hide();
		},
		success: (res) => {
			if (res.message) {
				toastr.options.onShown = function () { $('#loading').show(); }
				toastr.options.onHidden = function () {
					$('#loading').hide();
					signOut()
				}
				toastr["error"](res.message)
			}
			questions = res
			i = 0
			for (question of res) {
				let fieldset = '<fieldset class="field' + i + '" ><h3 class="question" id="' + question._id + '">' + question.Question + '' +
					'</h3><div class="row"><div class="options col-md-12"><p><label><input name="' + question._id + '" onchange="enableNext(\'' + question._id + '\')" type="radio" value="op1"' +
					'/><span>' + question.op1 + '</span></label></p></div></div><div class="row"><div class="options col-md-12"><p><label><input onchange="enableNext(\'' + question._id + '\')" name="' + question._id + '" type="radio" value="op2"' +
					'/><span>' + question.op2 + '</span></label></p></div></div><div class="row"><div class="options col-md-12"><p><label><input onchange="enableNext(\'' + question._id + '\')" name="' + question._id + '" type="radio" value="op3"' +
					'/><span>' + question.op3 + '</span></label></p></div></div><div class="row"><div class="options col-md-12"><p><label><input onchange="enableNext(\'' + question._id + '\')" name="' + question._id + '" type="radio" value="op4"' +
					'/><span>' + question.op4 + '</span></label></p></div></div><input id="btn' + question._id + '" disabled type="button" name="next" class="next action-button" value="Next" onclick="checkAns(\'' + question._id + '\',' + i + ')" /></fieldset>'
				let html = $.parseHTML(fieldset)
				$('#msform').append(html)
				i++
			}
			$('#start').fadeOut()
			$('#questionContainer').fadeIn()
			const text = formQuestionText(0)
			play(text)
		}
	})
}

function enableNext(id) {
	$(`#btn${id}`).removeAttr("disabled")
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
	$.ajax({
		url: 'checkAns',
		method: 'post',
		data: {
			qid: id,
			answer: $("input[name=" + id + "]:checked").val()
		},
		beforeSend: function () {
			$('#loading').show();
		},
		complete: function () {
			$('#loading').hide();
		},
		success: (res) => {
			if (res) {
				if (i !== questions.length - 1) {
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
				} else {
					submit()
				}
			}
			else {
				toastr["error"]("Something Went Wrong")
				window.location.href = '/'
			}
		}
	})
}

/* Sends the final score to the backend */
function submit() {
	text = "PLease hold on. Submitting your final score. Thank You"
	play(text)
	toastr.options.onShown = function () { $('#loading').show(); }
	toastr.options.onHidden = function () {
		$('#loading').hide();
		signOut()
	}
	toastr["success"]("Thank You")
}