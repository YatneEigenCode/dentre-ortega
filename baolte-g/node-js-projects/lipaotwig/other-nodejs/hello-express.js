//5-7-2916 jchoy hello-express.js - successfully implements textStore
//follows sample code from http://webapplog.com/url-parameters-and-routing-in-express-js/
//see also http://expressjs.com/en/guide/routing.html
var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
require( './js/TextStore.js' );

// respond with "hello world" when a GET request is made to the homepage
app.get('/e/', function(req, res) {
  res.send('hello express');
});
app.get('/ep/:i', function(req, res) {
  res.send('hello '+req.params.i);
});
app.get('/e/set/:i/:data', function(req, res) {
  textStore.save( req.params.i, req.params.data );
  res.send('saved to '+req.params.i);
});
app.get('/e/text/:i', function(req, res) {
  res.send( textStore.get(req.params.i) );
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Express server listening at", addr.address + ":" + addr.port);
});

textStore= new TextStore();
