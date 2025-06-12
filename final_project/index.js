const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const expressListEndpoints = require('express-list-endpoints');
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


app.use("/customer/auth/*", function auth(req, res, next){
	//console.log(req.header('Authorization'));
	let token = req.header('Authorization').split(' ')[1];
	if (token) {
		console.log("Inside middleware .... token is " + token);
		const decode = jwt.verify(token, "access");
		if (decode) {
			console.log(decode);
			const credentials = decode['data'].split('=');
			const {username, password} = credentials;
			console.log("user and pasword are ", username, password);
			req.params.user = username;
			next();
		} else {
			return res.status(403).json({message: "User not authorized"});
		}
	} else {
		return res.status(403).json({message: "User not logged in"});
	}	
});


const PORT =4173;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

const endpoints = expressListEndpoints(app);
console.log(endpoints);
app.listen(PORT,()=>console.log("Server is running"));
