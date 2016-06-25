//5-8-2016 jchoy hello-router.js successfully implements textStore w/o persistence (for relay)
//from https://howtonode.org/hello-node
// Load the node-router library by creationix
var server = require('node-router').getServer();
var fs= require('fs');
require( './js/TextStore.js' );

// Configure our HTTP server to respond with Hello World the root request
server.get("/", function (request, response) {
  response.simpleText(200, "Hello World!");
});

// Listen on port 8080 on localhost
//server.listen(8000, "localhost");
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0");

server.get("/rq/", function (request, response) {
  fs.writeFileSync('pdata/rqtest.txt',request.url);
  response.simpleText(200, "Hello node-router query: "+ ts.cgi('i','na',request.url) );
});
//_readableState readable domain _events _eventsCount _maxListeners socket connection httpVersionMajor httpVersionMinor httpVersion complete headers rawHeaders trailers rawTrailers upgrade url method statusCode statusMessage client _consuming _dumped setTimeout read _read destroy _addHeaderLines _addHeaderLine _dump push unshift isPaused setEncoding pipe unpipe on addListener resume pause wrap setMaxListeners getMaxListeners emit once removeListener removeAllListeners listeners listenerCount 

//this is an express pattern that does not work with node-router
//server.get("/rp/:i", function (request, response) {
//  response.simpleText(200, "ola "+request.params.i);
//});

ts= new TextStoreCgi();
ts.startServer( server );