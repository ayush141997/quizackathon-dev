$(document).ready(() => {
    $.ajax({
        url: 'leaderBoard',
        method: 'post',
        success: (res) => {
            let row = '<thead><th>S.no</th><th>Name</th><th>Category</th><th>Score</th></thead>'
            let i = 1
            for (record of res) {
                let cat
                switch (record.category) {
                    case "csit": cat = "Information Technology"
                        break
                    case "sports": cat = "Sports"
                        break
                    case "currAff": cat = "Current Affairs"
                        break
                    default: cat = "Entertainment"
                        break;
                }
                row += '<tr><td>' + i + '</td><td>' + record.name + '</td><td>' + cat + '</td><td>' + record.score + '</td></tr>'
                makeList(i)
                i++
            }
            drawList(row)
        }
    })
})

var list = new Array();
var pageList = new Array();
var currentPage = 1;
var numberPerPage = 10;
var numberOfPages = 0;

function makeList(x) {
    list.push(x);

    numberOfPages = getNumberOfPages();
}

function getNumberOfPages() {
    return Math.ceil(list.length / numberPerPage);
}

function nextPage() {
    currentPage += 1;
    loadList();
}

function previousPage() {
    currentPage -= 1;
    loadList();
}

function firstPage() {
    currentPage = 1;
    loadList();
}

function lastPage() {
    currentPage = numberOfPages;
    loadList();
}

function loadList() {
    var begin = ((currentPage - 1) * numberPerPage);
    var end = begin + numberPerPage;

    pageList = list.slice(begin, end);
    drawList();
    check();
}

function drawList(row) {
    document.getElementById("list").innerHTML = "";
    for (r = 0; r < pageList.length; r++) {
        document.getElementById("list").innerHTML += row;
    }
}

function check() {
    document.getElementById("next").disabled = currentPage == numberOfPages ? true : false;
    document.getElementById("previous").disabled = currentPage == 1 ? true : false;
    document.getElementById("first").disabled = currentPage == 1 ? true : false;
    document.getElementById("last").disabled = currentPage == numberOfPages ? true : false;
}

function load() {
    makeList();
    loadList();
}

window.onload = load;