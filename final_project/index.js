const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());


app.use("/customer",
	session({
		secret: "fingerprint_customer",
		resave: true,
		saveUninitialized: true		
	}));

app.use("/customer/review/", function auth(req, res, next){
	console.log(req.header('Authorization'));
	let token = req.header('Authorization').split(' ')[1];
	if (token) {
		console.log("Inside middleware .... token is " + token);
		const decode = jwt.verify(token, "access");
		console.log("Docoded token is ", decode);
		jwt.verify(token, "access", (err, user) => {
			if (!err) {
				console.log("authorization passed, moving to next middleware", user);
				next();
			} else {
				return res.status(403).json({message: "User not authorized"});
			}
		});
	} else {
		return res.status(403).json({message: "User not logged in"});
	}	
});

const PORT =4173;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
