$(document).ready(() => {
    $('select').formSelect()
    getQuestions()
})

function getQuestions() {
    $.ajax({
        url: 'getQuestions',
        method: 'POST',
        data: {
            role: 'admin',
            quizId: localStorage.getItem('quizId')
        },
        beforeSend: () => {
            $('#loading').show();
        },
        complete: () => {
            $('#loading').hide();
        },
        success: (res) => {
            // console.log(res)
            let rows = ''
            $('#questions').html('')
            rows += `<col width="80%">
            <col width="10%">
            <col width="10%">`
            res.forEach(ques => {
                rows += `<tr id="${ques._id}">
                            <td>${ques.Question}</td>
                            <td>
                                <a class="waves-effect waves-light" onclick="edit('${ques._id}')" name="action">
                                    <i class="material-icons right">edit</i>
                                </a>
                            </td>
                            <td>
                                <a class="waves-effect waves-light" onclick="del('${ques._id}')" name="action">
                                    <i class="material-icons right">delete</i>
                                </a>
                            </td>
                        </tr>`
            })
            $('#questions').append(rows)
        }
    })
}

function edit(id) {
    $.ajax({
        url: 'getQuestionById?id=' + id,
        method: 'GET',
        beforeSend: () => {
            $('#loading').show();
        },
        complete: () => {
            $('#loading').hide();
        },
        success: (res) => {
            console.log(res)
            if (res.status === 200) {
                $('#question').val(res.ques['Question'])
                $('#question').attr("tabindex", -1).focus()
                $('#option1').val(res.ques['op1'])
                $('#option1').attr("tabindex", -1).focus()
                $('#option2').val(res.ques['op2'])
                $('#option2').attr("tabindex", -1).focus()
                $('#option3').val(res.ques['op3'])
                $('#option3').attr("tabindex", -1).focus()
                $('#option4').val(res.ques['op4'])
                $('#option4').attr("tabindex", -1).focus()
                $('#ans').val(res.ques['Ans'])
                $('#question').attr("tabindex", -1).focus()
                $('select').formSelect()
                $('#quesId').val(`${id}`)
            }
        }
    })
}

function del(id) {
    $.ajax({
        url: 'delQuestion',
        method: 'POST',
        data: {
            qid: id
        },
        beforeSend: () => {
            $('#loading').show();
        },
        complete: () => {
            $('#loading').hide();
        },
        success: (res) => {
            // console.log(res)
            if (res.status === 200) {
                $(`#${res.data}`).remove()
            }
        }
    })
}

function addQuestion() {
    event.preventDefault()
    // let data = document.getElementById('addQuestion')
    let formData = $('#addQuestion').serializeArray()
    let data = {}
    formData.forEach((el, index) => {
        data[el.name] = el.value
        if (index === formData.length - 1) {
            data['quizId'] = localStorage.getItem('quizId')
            $.ajax({
                url: 'addQuestion',
                method: 'POST',
                data: data,
                beforeSend: () => {
                    $('#loading').show();
                },
                complete: () => {
                    $('#loading').hide();
                },
                success: (res) => {
                    console.log(res)
                    if (res.status === 200) {
                        getQuestions()
                    }
                }
            })
        }
    })
}