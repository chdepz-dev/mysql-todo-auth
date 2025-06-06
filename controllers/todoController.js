const db = require("../config/db")

exports.todoList = (req, res) => {
    db.query("SELECT * FROM todos WHERE user_id = ?", [req.session.userId], (err, todos) => {
        if (err) return res.status(500).send("Database error while fetching tasks");

        let list = todos.map(todo => `
            <link rel="stylesheet" href="/css/style.css">
            <li>
            <form class="list" style="display:inline" method="POST" action="/todo/edit/${todo.id}">
            <input class="todoList" type="text" name="task" value="${todo.task}"required>
            <button class="edit" type="submit" onclick="enableEdit(this)">Edit</button>
            </form>
            <form class="del "style="display:inline" method="POST" action="/todo/delete/${todo.id}">
             <button class="delete">Delete</button>
            </form>
            </li>
            `).join("")
        res.send(`
                <link rel="stylesheet" href="/css/style.css">
                <div class="container">
                <div class="main">
                <h2>YOUR TODO LIST</h2>
                <form method="POST" action="/todo/add" class="todo-form">
                <input type="text" name="task" placeholder=""New Task" required>
                <button class="submit" type="submit">Add task</button>
                </form>
                <ul>${list}</ul>
                <p>press enter to save your todo lists.😊</p>
                <a href="/logout" class="logout">logout</a>
                </div>
                </div>
                
`)
    })
}

exports.addTodo = (req, res) => {
    const { task } = req.body;
    if (!task) return res.status(400).send("Task Cannot be empty.");
    db.query("INSERT INTO todos SET ?", { user_id: req.session.userId, task }, err => {
        if (err) return res.status(500).send("Database error while adding task.");
        res.redirect("/todo");
    })
}

exports.deleteTodo = (req, res) => {
    db.query("DELETE FROM todos WHERE id = ? AND user_id = ?",[req.params.id,req.session.userId], err => {
        if (err) return res.status(500).send("Database error while deleting task");
        res.redirect("/todo");
    })
}

exports.editTodo = (req, res) => {
    const { task } = req.body;
    if (!task) return res.status(400).send("Task cannot be empty.");
    db.query("UPDATE todos SET task = ? WHERE id = ? AND user_id =?", [task, req.params.id, req.session.userId], err => {
        if (err) return res.status(500).send("Database error while updating task");
        res.redirect("/todo");
    })
}