let list = [] // list to store the results
let currentPage = 1; // to track the current page
let numberPerPage = 10; // number of records in one page
let numberOfPages = 0; // total number of pages
let modal
document.addEventListener('DOMContentLoaded', function () {
    filter()
    getQuizes()
    let elems = document.querySelectorAll('.modal');
    modal = M.Modal.init(elems);
});

// Set the number of pages to be made
function setNumberOfPages() {
    numberOfPages = Math.ceil(list.length / numberPerPage);
}

// To get the next page
function nextPage() {
    currentPage += 1;
    loadList();
}

// To get the previous page
function previousPage() {
    currentPage -= 1;
    loadList();
}

// To get the first page
function firstPage() {
    currentPage = 1;
    loadList();
}

// To get the last page
function lastPage() {
    currentPage = numberOfPages;
    loadList();
}

// To divide the record into pages and load it
function loadList() {
    var begin = ((currentPage - 1) * numberPerPage);
    var end = begin + numberPerPage;
    let index = begin + 1
    let pageList = list.slice(begin, end);
    drawList(pageList, index);
    check();
}

/* To put the list in the table
@Param pageList : records to be entered in that page
@Param index : index of the user 
*/
function drawList(pageList, index) {
    const head = '<thead><th>S.No</th><th>Name</th><th>Score</th></thead>'
    let row = ''
    for (record of pageList) {
        row += '<tr><td>' + index + '</td><td>' + record.name + '</td><td>' + record.score + '</td></tr>'
        index++
    }
    document.getElementById("list").innerHTML = head + row;
}

// To check the buttons for swapping the pages and act accordingly
function check() {
    document.getElementById("next").disabled = currentPage == numberOfPages ? true : false;
    document.getElementById("previous").disabled = currentPage == 1 ? true : false;
    document.getElementById("first").disabled = currentPage == 1 ? true : false;
    document.getElementById("last").disabled = currentPage == numberOfPages ? true : false;
}

// To sort the records
function sort(order) {
    list.sort(function (a, b) {
        if (order == 1) {
            return a.score - b.score
        } else {
            return b.score - a.score
        }
    })
    currentPage = 1
    loadList()
}

// To filter and get the records from backend
function filter() {
    $.ajax({
        url: 'leaderBoard',
        data: {
            quizId: localStorage.getItem('quizId')
        },
        method: 'post',
        success: (res) => {
            if (!res.status) {
                list = res
                setNumberOfPages()
                loadList()
            } else {
                console.log(res);
                document.getElementById("next").disabled = true
                document.getElementById("previous").disabled = true
                document.getElementById("first").disabled = true
                document.getElementById("last").disabled = true
                document.getElementById("list").innerHTML = "No record to show"
                $('#sort').fadeOut()
            }

        }
    })
}

function getQuizes() {
    $.ajax({
        url: 'getQuizes',
        method: 'get',
        success: (res) => {
            // console.log(res)
            if (res.status === 200) {
                res.quizes.forEach(quiz => addOption(quiz))
            }
            var elems = document.querySelectorAll('select');
            var instances = M.FormSelect.init(elems);
        }
    })
}

function setQuizId(val) {
    if (val === "new") {
        modal[0].open()
    } else {
        localStorage.setItem('quizId', val)
        filter()
    }
}

function addQuiz() {
    $.ajax({
        url: 'addQuiz',
        method: 'post',
        data: {
            name: $('#qName').val()
        },
        success: (res) => {
            console.log(res)
            if (res.status === 200) {
                addOption(res.quiz)
            }
        }
    })
}

function addOption(quizOption) {
    let option = `<option value="${quizOption._id}">${quizOption.name}</option>`
    $('#quizes').append(option)
    if (quizOption.status === "Ongoing") {
        $('#newQuiz').prop('disabled','true')
        $('#endQuiz').removeAttr('disabled')
        $('#endQuiz').attr('onclick',`endQuiz('${quizOption._id}')`)
        $('#quizes').val(quizOption._id)
        localStorage.setItem('quizId', quizOption._id)
    } else if(localStorage.getItem('quizId')){
        $('#quizes').val(localStorage.getItem('quizId'))
    }
    var elems = document.querySelectorAll('#quizes');
    var instances = M.FormSelect.init(elems);
}

function endQuiz(id){
    $.ajax({
        url: 'endQuiz',
        method: 'post',
        data: {
            id: id
        },
        success: (res) => {
            $('#endQuiz').prop('disabled','true')
            alert('Quiz Ended')
        }
    })
}
