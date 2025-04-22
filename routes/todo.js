
const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const authMiddleware = require("../middlewares/authMiddleware");


//display todo list
router.get("/", authMiddleware, todoController.todoList);

//add new todo
router.post("/add", authMiddleware, todoController.addTodo);

//edit todo
router.post("/edit/:id", authMiddleware, todoController.editTodo);

//delete todo
router.post("/delete/id", authMiddleware, todoController.deleteTodo);

module.exports = router;
