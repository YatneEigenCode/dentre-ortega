//3-6-17 jchoy OrderFeesWS, SendOrdersResult
var http = require('http');
var qs = require('querystring');
var fs = require('fs');
require( './orderfees.js' );

OrderFeesWS = function(){
  (function(o,c){o.c=c;o.c()})( this, OrderFees );
  this.httpOrder= "[]";
  this.getStringFor= function(id){
    if (id=="fees") return fs.readFileSync('fees.json');
    if (id=="orders") return this.httpOrders;
  }
  this.sendOrdersResult= function( httpData, apiNum ){
    this.httpOrders= httpData;
    this.calcOrders( false );
    return JSON.stringify( (apiNum==1)?
      this.prepOrdersTotal() : this.prepOrdersFunds() );
  }
  this.prepOrdersTotal= function(){
    var res= [];
    for (var i=0,at=this.orders; i<at.length; i++){
      var order= { order_number: at[i].number };
      order.order_items= at[i].pricedItems;
      order.total= at[i].getTotal();
      res.push( order );
    }
    return res;
  }
  this.prepOrdersFunds= function( ){
    var res= [{"msg":"NA"}];
  }
}

OrderFeesAPI= function(){
  this.fees = new OrderFeesWS();
  this.fees.loadFees();  //initialize with fees data
  var $svr = this;
  this.api1= "/price";
  this.api2= "/distribution";

  this.reqHandler = function( request, res ){
    if(request.method == "POST") {
      if ( (request.url == $svr.api1) || (request.url == $svr.api2) ) {
        var requestBody = '';
        request.on('data', function(data) {
          requestBody += data;
          if(requestBody.length > 1e7)
            $svr.sendText( res, 413, "Request Entity Too Large" );
        });
        request.on('end', function() {
          var orderBag= new OrderFeesWS();
          orderBag.feeTaps= $svr.fees.feeTaps; //reuse fees data
          var formData = qs.parse(requestBody);
          $svr.sendText( res, 200,
              orderBag.sendOrdersResult(
                formData.orders,
                (request.url==$svr.api1)? 1:2)
          );
        });
      } else $svr.sendText( res, 404, "Not Found" );
    }
    else if(request.method == "GET") {
      $svr.sendText( res, 404, "Use POST instead" );
    }
  }
  this.notFound = function( req, res ){ $svr.sendText(res, 404, "Not found\n"); }
  this.sendText = function( res, stat, msg, ctype ){
    res.writeHead( stat, {"Content-Type": ((ctype)? ctype : "text/plain")} );
    res.end(msg);
  }
}
var server = http.createServer( new OrderFeesAPI().reqHandler );



server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("server listening at", addr.address + ":" + addr.port);
});
