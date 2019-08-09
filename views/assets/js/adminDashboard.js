let list = [] // list to store the results
let currentPage = 1; // to track the current page
let numberPerPage = 10; // number of records in one page
let numberOfPages = 0; // total number of pages

$(document).ready(() => {
    $('select').formSelect()
    filter()
})

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
    const head = '<thead><th>S.No</th><th>Name</th><th>Category</th><th>Score</th></thead>'
    let row = ''
    for (record of pageList) {
        let category
        if (record.category == "csit") {
            category = "Information Technology"
        } else if (record.category == "sports") {
            category = "Sports"
        } else if (record.category == "currAff") {
            category = "Current Affairs"
        } else {
            category = "Entertainment"
        }
        row += '<tr><td>' + index + '</td><td>' + record.name + '</td><td>' + category + '</td><td>' + record.score + '</td></tr>'
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
function sort(order){
    list.sort(function(a,b) {
        if(order == 1){
            return a.score - b.score
        }else{
            return b.score - a.score
        }
    })
    currentPage = 1
    loadList()
}

// To filter and get the records from backend
function filter(category){
    $.ajax({
        url: 'leaderBoard',
        data : {
            category : category
        },
        method: 'post',
        success: (res) => {
            list = res
            setNumberOfPages()
            loadList()
        }
    })
}
