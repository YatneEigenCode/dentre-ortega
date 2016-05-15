//5-13-2016 jchoy v0.213 commit payload
//5-8-2916 jchoy server-bum.js - to use with bare nodejs on android ice cold server
var http = require('http');
require( './js/TextStore.js' );
var bum = new TextStoreWebApp();
var server = http.createServer(bum.reqHandler);
var fs= require('fs');

bum.addGetPath( '/commit/', function(req, res){
    fs.writeFileSync( bum.getFilePath(), bum.getPayload() );
    bum.sendText( res, 200, "Saved to  "+bum.getFilePath() );
})
bum.addGetPath( '/ts', function(req, res){
    bum.sendText( res, 200, fs.readFileSync('pub_html/textStore.htm'), "text/html" );
})
bum.addGetPath( '/ok88.element.base.js', function(req, res){
    bum.sendText( res, 200, fs.readFileSync('pub_html/js/ok88.element.base.js') );
})

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Bum server listening at", addr.address + ":" + addr.port);
});
