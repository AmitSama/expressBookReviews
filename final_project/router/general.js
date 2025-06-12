const express = require('express');
const axios = require('axios').default;
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

// Get all books using promise
public_users.get('/books',function (req, res) {
  const url = "http://localhost:4173";
  //console.log(url);
  const req1 = axios.get(url);
  req1.then(resp => {
	//console.log(resp);
	return res.status(200).json({books: resp.data.books});
  })
  .catch(err => {
	  console.log(err.toString());
	  return res.status(500).json({message: "Internal Server Error"});
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
	return res.status(200).json({book: books[isbn]});
  }	  
  return res.status(404).json({message: "isbn not found"});
 });


public_users.get('/isbnpro/:isbn',function (req, res) {
  const id = req.params.isbn;
  const url = "http://localhost:4173/isbn/"+id;
  const req1 = axios.get(url);
  req1.then(resp => {
	  //console.log(resp);
	  return res.status(200).json({book: resp.data.book});
  }).catch(err => {
	  return res.status(500).json({message: "Internal Server Error"});
  });
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


public_users.get('/authorpro/:author',function (req, res) {
  const auth = req.params.author;
  const url = "http://localhost:4173/author/"+auth;
  const req1 = axios.get(url);
  req1.then(resp => {
	  //console.log(resp);
	  return res.status(200).json({book: resp.data.book});
  })
  .catch(err => {
	  //console.log(err.toString());
	  return res.status(500).json({message: "Internal Server Error"});
  });
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

public_users.get('/titlepro/:title',function (req, res) {
  const title = req.params.title;
  const url = "http://localhost:4173/title/"+title;
  const req1 = axios.get(url);
  req1.then(resp => {
	  console.log(resp);
	  return res.status(200).json({book: resp.data.book});
  })
  .catch(err => {
	  return res.status(500).json({message: "Internal Server Error"});
  });
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
