const http = require('http');
const app = require('./services');
require("dotenv").config();
// const dotenv = require('../../env');
//const hostname = '127.0.0.1'; 
const port = process.env.USER_SERVICE_PORT || 3002

console.log("port: ", port )

//App.js contains the code to process the http request and send the response
const server = http.createServer(app);

server.listen(port, () => { 
    console.log(`Server running at ${port}`); 
});