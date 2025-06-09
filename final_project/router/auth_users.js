const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
	let validUsers = users.filter((u) => u.username === username);
	return validUsers.length > 0 ? true : false;
}

const authenticatedUser = (username,password)=> {
	let validUsers = users.filter((u) => {u.username === username && 
		u.password === password });
	return validUsers.length > 0 ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
	  return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username, password)) {
	  let token = jwt.sign({data: password}, 'access', {expiresIn: 60*60});
	  req.session.authorization = {
									token, 
									username
								};
	  return res.status(200).send("User successfully logged in");
  } else {
	  return res.status(208).json({message: "Invalid username or password"});	  
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const id = req.params.isbn;
  if (books[id]) {
	  const counter = Objects(books[id].reviews).length;
	  books[id].reviews = {count: counter, review : req.body.review};
	  return res.status(200).json({message: `Book with isbn ${id} is updated.`});
  }
  return res.status(300).json({message: "Book not found"});
});

module.exports.authenticated = regd_users;
module.exports.authenticatedUser = authenticatedUser;
module.exports.isValid = isValid;
module.exports.users = users;
