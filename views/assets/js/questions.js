//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches
$(document).ready(() => {
	console.log('set')
	localStorage.setItem('score',0)
})
$(".submit").click(function () {
	return false;
})

function getQuestions() {
	let urlPath = ''
	if (window.location.href.endsWith('csit')) {
		urlPath = "getQuesCsit"
	}else if (window.location.href.endsWith('currAff')) {
		urlPath = "getQuesCurraf"
	}else if (window.location.href.endsWith('sports')) {
		urlPath = "getQuesSports"
	}else if (window.location.href.endsWith('entertainment')) {
		urlPath = "getQuesEntertainment"
	}
	$.ajax({
		url: urlPath,
		method: 'post',
		success: (res) => {
			console.log(res)
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
		}
	})
}

function checkAns(id, i) {

	if (window.location.href.endsWith('csit')) {
		cat = "csit"
	}else if (window.location.href.endsWith('currAff')) {
		cat = "currAff"
	}else if (window.location.href.endsWith('sports')) {
		cat = "sports"
	}else if (window.location.href.endsWith('entertainment')) {
		cat = "entertainment"
	}
	$.ajax({
		url: 'checkAns',
		method: 'post',
		data: {
			qid: id,
			answer: $("input[name=" + id + "]:checked").val(),
			category: cat
		},
		success: (res) => {
			if (res) {
				let score = parseInt(localStorage.getItem('score')) + 5
				localStorage.setItem('score',score)
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
			}
			else{
				submit()
			}
		}
	})
}

function submit(){
	console.log(localStorage.getItem('score'))
	if (window.location.href.endsWith('csit')) {
		cat = "csit"
	}else if (window.location.href.endsWith('currAff')) {
		cat = "currAff"
	}else if (window.location.href.endsWith('sports')) {
		cat = "sports"
	}else if (window.location.href.endsWith('entertainment')) {
		cat = "entertainment"
	}
	$.ajax({
		url : 'submitScore',
		method : 'post',
		data : {
			score : localStorage.getItem('score'),
			category : cat
		},
		success : (res) => {
			if(res){
				toastr.options.onShown = function() { console.log('hello'); }
				toastr.options.onHidden = function() { 
					localStorage.clear()
					window.location.href = 'dashboard' }
				toastr["success"]("Your Score is: " + localStorage.getItem('score'))
			}else{
				toastr["error"]("Something Went Wrong")
				window.location.href = 'dashboard'	
			}
		}
	})
}

var time_in_minutes = 2;
var current_time = Date.parse(new Date());
var deadline = new Date(current_time + time_in_minutes*60*1000);


function time_remaining(endtime){
	var t = Date.parse(endtime) - Date.parse(new Date());
	var seconds = Math.floor( (t/1000) % 60 );
	var minutes = Math.floor( (t/1000/60) % 60 );
	return {seconds,minutes};
}

function run_clock(id,endtime){
	var clock = document.getElementById(id);
	function update_clock(){
		var t = time_remaining(endtime);
		clock.innerHTML = "Time  "+t.minutes+":"+t.seconds;
		if(t.minutes==0 & t.seconds==0){ clearInterval(timeinterval); submit(); }
	}
	update_clock(); // run function once at first to avoid delay
	var timeinterval = setInterval(update_clock,1000);
}
run_clock('clockdiv',deadline);
