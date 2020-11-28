function showFrontPage() {
    $('#login-form').show()
    $('#register-form').hide()
    $('#google-login').show()
    $('#main-page').hide()
    $('#btn-logout').hide()
}

function showRegisterPage() {
    $('#login-form').hide()
    $('#register-form').show()
}

function login() {
    const email = $('#email-login').val()
    const password = $('#password-login').val()
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/login",
        data: { email, password }
    })
        .done(response => {
            localStorage.setItem('access_token', response.access_token)
            showMainPage()
        })
        .fail((xhr, textStatus) => {
            console.log(xhr.responseJSON, textStatus)
        })
        .always(_ => {
            $('#email-login').val('')
            $('#password-login').val('')
        })
}

function showMainPage() {
    $('#login-form').hide()
    $('#register-form').hide()
    $('#google-login').hide()
    $('#update-form').hide()
    $('#main-page').show()
    $('#btn-logout').show()
    $('#add-form').show()
    $('#content').show()
    // fetchShollu()
    fetchTodos()
}

function logout() {
    localStorage.clear()
    showFrontPage()
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      console.log('User signed out.');
    });
}

function fetchTodos() {
        $.ajax({
            method: "GET",
            url: "http://localhost:3000/todos",
            headers: {
                access_token: localStorage.getItem('access_token')
            }
        })
            .done(response => {
                $('#todo-list').empty()
                response.todo.forEach(todo => {
                    const date = todo.due_date.split('')
                    todo.due_date = ''
                    for (let i = 0; i < 10; i++) { todo.due_date += date[i] }
            
                    $('#todo-list').append(`
                    <div class="card text-center">
                        <div class="card-header">${todo.status}</div>
                        <div class="card-body">
                            <h5 class="card-title">${todo.title}</h5>
                            <p class="card-text">${todo.description}</p>
                            <a href="#" class="btn btn-primary btn-spacing" onclick="getOneTodos(${todo.id})">Update</a>
                            <a href="#" class="btn btn-primary btn-spacing" onclick="deleteTodos(${todo.id})">Delete</a>
                        </div>
                        <div class="card-footer text-muted">${todo.due_date}<div>
                    </div>`)
                });
            })
            .fail(xhr => {
                console.log(xhr.responseJSON)
            })
}

// function fetchShollu() {
//     $.ajax({
//         method: "GET",
//         url: "http://localhost:3000/shollu",
//         headers: {
//             access_token: localStorage.getItem('access_token')
//         }
//     })
//         .done(response => {
//             console.log(response)
//             // $('#shollu').empty()      
//             //     $('#shollu').append(`
//             //     <table class="table">
//             //         <thead class="thead-dark">
//             //           <tr>
//             //             <th scope="col">#</th>
//             //             <th scope="col">First</th>
//             //             <th scope="col">Last</th>
//             //             <th scope="col">Handle</th>
//             //           </tr>
//             //         </thead>
//             //         <tbody>
//             //           <tr>
//             //             <th scope="row">1</th>
//             //             <td>Mark</td>
//             //             <td>Otto</td>
//             //             <td>@mdo</td>
//             //           </tr>
//             //           <tr>
//             //             <th scope="row">2</th>
//             //             <td>Jacob</td>
//             //             <td>Thornton</td>
//             //             <td>@fat</td>
//             //           </tr>
//             //         </tbody>
//             //       </table>`)                  
//         })
//         .fail(xhr => {
//             console.log(xhr)
//         })
// }

function createTodos() {
    const title = $('#title-add').val()
    const description = $('#description-add').val()
    const status = $('#status-add').val()
    const due_date = $('#due_date-add').val()
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/todos",
        headers: {
            access_token: localStorage.getItem('access_token')
        },
        data: { title, description, status, due_date }
    })
        .done(response => {
            fetchTodos()
            // fetchShollu()
        })
        .fail(xhr => {
            console.log(xhr)
        })
        .always(_ => {
            $('#add-form').trigger('reset')
        })
}

function deleteTodos(id) {
    $.ajax({
        method: "DELETE",
        url: "http://localhost:3000/todos/" + id,
        headers: {
            access_token: localStorage.getItem('access_token')
        }
    })
        .done(response => {
            fetchTodos()
            // fetchShollu()
        })
        .fail(xhr => {
            console.log(xhr)
        })
}

function getOneTodos(id) {
    $('#update-form').show()
    $('#btn-logout').hide()
    $('#add-form').hide()
    $('#content').hide()
    $('#update-form').empty()
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/todos/" + id,
        headers: {
            access_token: localStorage.getItem('access_token')
        }
    })
        .done(todo => {
            const date = todo.due_date.split('')
            todo.due_date = ''
            for (let i = 0; i < 10; i++) { todo.due_date += date[i] }

            $('#update-form').append(`
            <h1 class="center">update Todo</h1> <br>
                <form>
                <div class="form-group">
                    <label for="title">Title</label>
                    <input type="title" class="form-control" id="title-update" aria-describedby="emailHelp" value="${todo.title}">
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <input type="description" class="form-control" id="description-update" value="${todo.description}">
                </div>
                <div class="form-group">
                    <label for="status">Status</label>
                    <input type="status" class="form-control" id="status-update" value="${todo.status}">
                </div>
                <div class="form-group">
                    <label for="due_date">Due date</label>
                    <input type="due_date" class="form-control" id="due_date-update" value="${todo.due_date}">
                </div>
                <button type="submit" class="btn btn-primary" id="btn-update" onclick="updateTodos(${todo.id})">Submit</button>
            </form>`)
        })
        .fail(xhr => {
            console.log(xhr)
        })
}

function updateTodos(id) {
    const title = $('#title-update').val()
    const description = $('#description-update').val()
    const status = $('#status-update').val()
    const due_date = $('#due_date-update').val()
    const updatedAt = (new Date).toISOString()
    $.ajax({
        method: "PUT",
        url: "http://localhost:3000/todos/" + id,
        headers: {
            access_token: localStorage.getItem('access_token')
        },
        data: { title, description, status, due_date, updatedAt }
    })
        .done(response => {
            showMainPage()
        })
        .fail(xhr => {
            console.log(xhr.responseJSON)
        })
        .always(_ => {
            $('#add-form').trigger('reset')
        })
}

function register() {
    const email = $('#email-register').val()
    const password = $('#password-register').val()
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/register",
        data: { email, password }
    })
        .done(response => {
            alert('register succes')
        })
        .fail(xhr => {
            console.log(xhr)
        })
        .always(_ => {
            $('#email-register').val('')
            $('#password-register').val('')
        })

}

function onSignIn(googleUser) {
    const googleToken = googleUser.getAuthResponse().id_token;

    $.ajax({
        method: "POST",
        url: "http://localhost:3000/googleLogin",
        data: { googleToken }
    })
    .done(response => {
        localStorage.setItem('access_token', response.access_token)
        showMainPage()
    })
    .fail(xhr => {
        console.log(xhr)
    })
}