const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const booksJS = require('./booksdb.js'); //get the data stored as a JS object 
public_users.post("/register", (req,res) => {
  //Write your code here

  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  
  return res.status(200).send(JSON.stringify(booksJS,null,4)); //send response with 200 status code for sucess with stringify for a formated output
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = booksJS[isbn];//store the book with the coresponding isbn
  if(book){
    res.status(200).send(JSON.stringify(book,null,4)) //return the book is it exists 
  }
  else{
    res.status(404).json({message : 'book not found '});//return 404 status code with not found message 
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
