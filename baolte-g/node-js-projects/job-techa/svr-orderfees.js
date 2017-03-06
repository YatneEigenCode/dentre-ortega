var http = require('http');
var qs = require('querystring');
var fs = require('fs');
require( './orderfees.js' );
var orderFees = new OrderFees();
OrderFeesAPI= function(){
  (function(o,c){o.c=c;o.c()})( this, OrderFees );
  var $svr = this;
  this.reqHandler = function( req, res ){
    if(request.method == "POST") {
      if (request.url == "/price") {
      var requestBody = '';
      request.on('data', function(data) {
        requestBody += data;
        if(requestBody.length > 1e7)
          $svr.sendText( res, 413, "Request Entity Too Large" );
      });
      request.on('end', function() {
        var formData = qs.parse(requestBody);
        formData.orders;
      }
      if (request.url == "/distribution") {
      }
      else $svr.sendText( res, 404, "Not Found" );
    }
  else if(request.method == "GET") {
      if (request.url == "/price") {
      }
      else if (request.url == "/distribution") {
      }
      else $svr.sendText( res, 404, "Not Found" );
    }
  this.notFound = function( req, res ){ $svr.sendText(res, 404, "Not found\n"); }
  this.sendText = function( res, stat, msg, ctype ){
    res.writeHead( stat, {"Content-Type": ((ctype)? ctype : "text/plain")} );
    res.end(msg);
  }
  this.getStringFor= function(id){
    if (id=="fees") return fs.readFileSync('fees.json');
    if (id=="orders") return fs.readFileSync(bum.getFilePath());
  }
}
var server = http.createServer( new OrderFeesAPI().reqHandler );



server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("server listening at", addr.address + ":" + addr.port);
});
