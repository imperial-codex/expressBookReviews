const express = require('express');
const booksJS = require('./booksdb.js'); //get the data stored as a JS object 
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!(username && password)) { //check if password and username are provided 
        return res.status(400).json({ message: " username and password required " });
    }
    for (const user of users) {//check if username already exists
        if (username.toLowerCase() === user.username.toLowerCase()) {
            return res.status(409).json({ message: "Username already exists" });
        }
    }
    users.push({ username, password });//add user to list if all test are passed 
    return res.status(201).json({ message: "registration successful " });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(booksJS, null, 4)); //send response with 200 status code for sucess with stringify for a formated output
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = booksJS[isbn];//store the book with the coresponding isbn
    if (book) {
        return res.status(200).send(JSON.stringify(book, null, 4)) //return the book is it exists 
    }
    else {
        return res.status(404).json({ message: 'book not found ' });//return 404 status code with not found message 
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    books = [];
    for (const isbn in booksJS)//loop to add all books with the coresponding author to the list
    {
        if (booksJS[isbn].author == author) {
            books.push(booksJS[isbn])
        }
    }

    if (books.length > 0) {
        return res.status(200).send(JSON.stringify(books, null, 4)) //send the list of books as string if any where found 
    }

    return res.status(404).json({ message: "author not in list" });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    books = [];
    for (const isbn in booksJS)//loop to add all books with the coresponding title the list
    {
        if (booksJS[isbn].title.toLowerCase() == title) {
            books.push(booksJS[isbn])
        }
    }

    if (books.length > 0) {
        return res.status(200).send(JSON.stringify(books, null, 4)) //send the list of books as string if any where found 
    }
    else {
        return res.status(404).json({ message: title + " not in list" });
    }

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (!booksJS[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    const review = booksJS[isbn].reviews;

    if (review) {
        return res.status(200).send(review) //send the review as string if any where found 
    }
    else {
        return res.status(404).json({ message: " no review found " });
    }
});
function getBooks() {
    axios.get("http://localhost:5000/")
        .then(response => {
            console.log("books in the store : ");
            console.log(JSON.stringify(response.data, null, 4));

        })
        .catch(error => {
            console.error("error fetching books", error.message);
        })
}
function getBookISBN(isbn) {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => {
            console.log("fetching details for book  ", isbn, ":\n", JSON.stringify(response.data, null, 4));
        })
        .catch(error => {
            if (error.response) {
                console.error("error : ", error.response.data);
            }
            else { console.error("error : ", error.message); }
        })
}
function getBookAUTHOR(author) {
    axios.get(`http://localhost:5000/author/${author}`)
        .then(response => {
            console.log(`fetching details for books by : ${author}`, JSON.stringify(response.data, null, 4));
        })
        .catch(error => {
            if (error.response) {
                console.error("error : ", error.response.data);
            }
            else { console.error("error : ", error.message); }
        })
}
function getBookTITLE(title){
    axios.get(`http://localhost:5000/title/${title}`)
    .then(response=>{
        console.log(`fetching details for the book  : ${title}`, JSON.stringify(response.data, null, 4));
    })
    .catch(error => {
        if (error.response) {
            console.error("error : ", error.response.data);
        }
        else { console.error("error : ", error.message); }
    })
}

//getBooks();
//getBookISBN('5');
//getBookAUTHOR("Samue Beckett");
getBookTITLE("One Thousand and One Nights")
//console.log(Object.keys(booksJS))
module.exports.general = public_users;
