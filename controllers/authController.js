const bcrypt = require("bcryptjs");
const db = require("../config/db");
const path = require("path");

exports.getRegister = (req, res) => res.sendFile(path.join(__dirname, '../public/html/register.html'));
exports.register = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send("All fields are required");

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status.send("server error while hashing passsword");
        db.query("INSERT INTO users SET?", { username, password: hash }, err => {
            if (err) return res.status(500).send("Database error during registration");
            res.redirect("/login")
        })
    })
}

exports.getLogin = (req, res) => res.sendFile(path.join(__dirname, '../public/html/login.html'));

exports.login = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send("all fields are required");

    db.query("SELECT * FROM users WHERE username = ?", [username], (error, results) => {
        if (error) return res.status(500).send("Database error while verifying user");
        if (!results.length) res.status(401).send("Invalid credentials");

        bcrypt.compare(password, results[0].password, (err, match) => {
            if (err) return res.status(500).send("server error during password comparison")
            if (match) {
                req.session.userId = results[0].id;
                res.redirect("/todo");
            } else res.status.send(401).send("Invalid credentials")
        })
    })
}

exports.logout = (req, res) => {
    req.session.destroy(err =>{
        if(err) return res.status(500).send("failed to log out");
        res.redirect("/login")
    })
}