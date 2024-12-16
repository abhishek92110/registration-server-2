// const express = require("express");
// const app = express();
// const dbConnect = require("./db/conn");
// const users = require("./models/userSchema");
// const cors = require("cors");
// const router = require("./routes/router");
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const https = require('https');

// // Update the paths to the SSL certificate and key files
// const options = {
//   key: fs.readFileSync('C:\\Users\\Administrator\\Desktop\\privkey.pem'),
//   cert: fs.readFileSync('C:\\Users\\Administrator\\Desktop\\fullchain.pem')
// };

// dbConnect()

// const corsOptions = {
//     origin: '*', // or use '*' to allow all origins
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     allowedHeaders: '*',
// };

// app.use(cors(corsOptions));

// app.use(bodyParser.json());

// // Parse URL-encoded bodies
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.json());

// app.get("/", (req, res) => {
//     res.json("server running")
// })

// global.__basedir = __dirname;

// const initRoutes = require("./routes/index");

// app.use(express.urlencoded({ extended: true }));
// initRoutes(app);

// app.use(router);

// console.log("app js running");

// // Create an HTTPS server with the provided options
// https.createServer(options, app).listen(8000, () => {
//     console.log('HTTPS server listening on port 8000');
// });


const express = require("express");
const app = express();
const dbConnect = require("./db/conn");
const users = require("./models/userSchema");
const cors = require("cors");
const router = require("./routes/router");
const bodyParser = require('body-parser');

// Connect to the database
dbConnect();

// Configure CORS
const corsOptions = {
    origin: '*', // or use '*' to allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*',
};
app.use(cors(corsOptions));

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Define a base route
app.get("/", (req, res) => {
    res.json("server running");
});

global.__basedir = __dirname;

// Initialize routes
const initRoutes = require("./routes/index");
app.use(express.urlencoded({ extended: true }));
initRoutes(app);

// Use additional routes
app.use(router);

console.log("app js running");

// Create a simple HTTP server
app.listen(8000, () => {
    console.log('HTTP server listening on port 8000');
});
