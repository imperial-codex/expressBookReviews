const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const session = require("express-session");

app.use(session({
    secret: "imperial-codex_da_goat",
    resave: false,
    saveUninitialized: false
}));

const isValid = (username) => {
    // code to check is the username is valid
    for (const user of users) {
        if (username == user) {
            return true;
        }

    }
    return false;
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    const user = users.find(
        u => u.username.toLowerCase() === username.toLowerCase());
    // check password and username with least information reveal
    if (!user || user.password !== password) {
        return false;
    }
    return true;
}

//only registered users can login
regd_users.post("/login", (req, res) => {

    const { username, password } = req.body;

    //input validation
    if (!(username && password)) {
        return res.status(400).json({ message: "username and password required " })
    }

    //find user
    const user = users.find(
        u => u.username.toLowerCase() === username.toLowerCase());


    // check password and username with least information reveal
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "invalid credentials" });
    }
    //generate token
    const token = jwt.sign(
        { username: user.username },
        "imperial-codex_da_goat",
        { expiresIn: "1h" }
    );
    req.session.username = user.username;
    return res.status(200).json({ message: 'logged in ', token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    if (!(req.session && req.session.username)) {
        return res.status(401).json({ message: 'please log in' });
    } 
     const isbn = req.params.isbn;
     const username = req.session.username;
     const review = req.body;
      if (!books[isbn]) { 
        res.status(404).json({ message: "could not find the book " })
     }
      books[isbn].reviews[username] = review;
       return res.status(200).json({ message: "review added" });
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
