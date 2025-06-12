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
	users.map((user,index) => (console.log(user)));
	let validUsers = users.filter((u) => (u.username === username && 
		u.password === password ));
	return validUsers.length > 0 ? true : false;
}

/*
const auth = (req, res, next) => {
	//console.log(req.header('Authorization'));
	let token = req.header('Authorization').split(' ')[1];
	if (token) {
		console.log("Inside middleware .... token is " + token);
		const decode = jwt.verify(token, "access");
		if (decode) {
			next()
		} else {
			return res.status(403).json({message: "User not authorized"});
		}
	} else {
		return res.status(403).json({message: "User not logged in"});
	}	
}
*/

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
	  return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username, password) === true) {
	  let token = jwt.sign({data: username+"="+password}, "access", {expiresIn: "1h"});
	  return res.status(200).json({token: token, "message": "User successfully logged in"});
  } else {
	  return res.status(208).json({message: "Invalid username or password"});	  
  }
});

// Add a book review

regd_users.put("/auth/review/:isbn", (req, res) => {
  //auth(req, res, next);
  console.log("Inside review api");
  const isbn = req.params.isbn;
  const username = req.params.user;
  const review = req.body.review;
  if (books[isbn]) {
	  books[isbn].reviews[username] = review;
	  return res.status(200).json({message: `Book with isbn ${isbn} is updated.`});
  }
  return res.status(404).json({message: "Book not found"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //auth(req, res, next);
  console.log("Inside review api");
  const isbn = req.params.isbn;
  const username = req.params.user;
  if (books[isbn]) {
	  if (books[isbn].reviews[username]) {
		delete(books[isbn].reviews[username]);	  
		return res.status(200).json({message: `Reviews by user ${username} are deleted`});
	  }
  }
  return res.status(404).json({message: "Book or user not found for deleting reviews"});
});

module.exports.authenticated = regd_users;
module.exports.authenticatedUser = authenticatedUser;
module.exports.isValid = isValid;
module.exports.users = users;
