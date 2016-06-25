//6–25-2016 jchoy server-main.js v0.312 relic remote pseudo listener engine
var http = require('http');
var express = require('express');
var app = express();
require( './js/TextStore.js' );
require( './js/BumWebApp.js' );
require( './js/Relic.js' );
var server = http.createServer(app);
var tsc = new TextStoreExpApp();
tsc.startServer(app);

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Relic server listening at", addr.address + ":" + addr.port);
});
