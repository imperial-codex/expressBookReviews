const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
users.push({ username: "test", password: "258" });


const isValid = (username) => {
    return users.some(u => u.username === username);
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

    if (!(username && password)) {
        return res.status(400).json({ message: "username and password required" });
    }

    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (!user || user.password !== password) {
        return res.status(401).json({ message: "invalid credentials" });
    }

    // set up session
    req.session.username = user.username;

    req.session.save(err => {
        if (err) {
            return res.status(500).json({ message: "session save failed" });
        }

        
        return res.status(200).json({ message: "logged in" });
    });
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    if (!(req.session && req.session.username)) {
        return res.status(401).json({ message: 'please log in' });
    }

    const isbn = req.params.isbn;
    const username = req.session.username;
    const review = req.body.review;

    if (!books[isbn]) {
        return res.status(404).json({ message: "could not find the book" });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "review added" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
