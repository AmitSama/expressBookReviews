const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let authenticated = require("./auth_users.js").authenticated;
let authenticatedUser = require("./auth_users.js").authenticatedUser;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (username && password) {
		if (!authenticatedUser(username, password)) {
			users.push({"username": username, "password": password});
			return res.status(200).json({message : "User registered."})
		} else {
			return res.status(404).json({message : "User already registered."})
		}
  }
  return res.status(404).json({message: "Not able to register user"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json({books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
	return res.status(200).json({book: books[isbn]});
  }	  
  return res.status(404).json({message: "isbn not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let foundBook = null;
  for (key in books) {
    if (books[key]['author'] === author) {
        foundBook = books[key];
		break;
    }
  }
  if (foundBook) {
	  return res.status(200).json({book: foundBook});
  }
  return res.status(404).json({message: "Author not found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let foundBook = null;
  for (key in books) {
    if (books[key]['title'] === title) {
        foundBook = books[key];
		break;
    }
  }
  if (foundBook) {
	  return res.status(200).json({book: foundBook});
  }
  return res.status(404).json({message: "title not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
	return res.status(200).json({reviews: books[isbn]['reviews']});
  }	  
  return res.status(404).json({message: "Isbn not found"});
});

module.exports.general = public_users;
