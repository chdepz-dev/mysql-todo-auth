const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path")
const db = require("./config/db")
const authController = require("./controllers/authController")
const todoController = require("./controllers/todoController")
const authMiddleware = require("./middlewares/authMiddleware")

const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todo")

//intializing the app
const app = express();

//middlewares to parse the request bodies

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//setting up static files(css, html)
app.use(express.static(path.join(__dirname, "public")));

//session config

app.use(session({
    secret: "sjfeiojscnkdfjejiosjoss",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


//route modules
app.use("/", authRoutes);
app.use("/todo", todoRoutes)



// routes for authentication 
app.get("/login", authController.getLogin);
app.post("/login", authController.login);
app.get("/register", authController.getRegister);
app.get("/register", authController.register);
app.get("/logout", authController.logout);

//protected routes (only accessible if logged in);
app.get("/todo", authMiddleware, todoController.todoList);
app.post("/todo/add", authMiddleware, todoController.addTodo);
app.post("/todo/edit/:id", authMiddleware, todoController.editTodo);
app.post("/todo/delete/:id", authMiddleware, todoController.deleteTodo);

//home route (redirect to login if not authenticated);
app.get("/", (req, res) => {
    if (req.session.userId) {
        res.redirect("/todo")
    } else {
        res.redirect("/login");
    }
})

//set up the server to listen on a port 
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`server running on https://localhost:${PORT}`)
})