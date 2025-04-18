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

exports.login = (req, res) =>{
    const {username, password} = req.body;
    if(!username || password) return res.status(400).send("all fields are required");
    
    db.query("SELECT FROM users WHERE username?", [username],(error, results) =>{
        
    })
}