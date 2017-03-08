//3-6-17 jchoy prepOrderFunds
//answer (node.js RESTful API) for part 3 of technical assessment from
//https://gist.github.com/ericve25/4058b6625fc0976700b88bd0135eb060

var http = require('http');
var qs = require('querystring');
var fs = require('fs');
require( './orderfees.js' );  //reuse code from pt 1 & 2

//---extends OrderFees to be useful on server side
OrderFeesWS = function(){
  (function(o,c){o.c=c;o.c()})( this, OrderFees );
  this.httpOrder= "[]";
  //---override for different behavior
  this.getStringFor= function(id){
    if (id=="fees") return fs.readFileSync('fees.json');
    if (id=="orders") return this.httpOrders;
  }
  //---returns results that can be sent in http response
  this.sendOrdersResult= function( httpData, apiNum ){
    this.httpOrders= httpData;
    this.calcOrders( false );
    if (apiNum==2) this.fundDistribution( false );
    return JSON.stringify( (apiNum==1)?
      this.prepOrdersTotal() : this.prepOrdersFunds() );
  }
  //---formats price data results
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
  //---formats fund distribution results
  this.prepOrdersFunds= function( ){
    var res= [];
    for (var i=0,at=this.orders; i<at.length; i++){
      var order= { order_number: at[i].number };
      order.fund_items= at[i].distFunds;
      res.push( order );
    }
    return res;
  }
}

//Web API with requestHandler method
OrderFeesAPI= function(){
  this.fees = new OrderFeesWS();
  this.fees.loadFees();  //initialize with fees data
  var $svr = this;
  this.api1= "/price";
  this.api2= "/distribution";

  //---function to pass into http.createServer()
  this.reqHandler = function( request, res ){
    if(request.method == "POST") {
      if ( (request.url == $svr.api1) || (request.url == $svr.api2) ) {
        var requestBody = '';
        request.on('data', function(data) {
          requestBody += data;
          if(requestBody.length > 1e7)
            $svr.sendText( res, 413, "Request Entity Too Large" );
        });
        //--when ready to prepare and send response
        request.on('end', function(){
          var orderBag= new OrderFeesWS();
          orderBag.feeTaps= $svr.fees.feeTaps; //reuse fees data
          var formData = qs.parse(requestBody);
          var res= orderBag.sendOrdersResult( formData.orders,
                (request.url==$svr.api1)? 1:2 )
          $svr.sendText( res, 200, res );
        });
      } else $svr.sendText( res, 404, "Not Found" );
    } else if(request.method == "GET") {
      $svr.sendText( res, 405, "Use POST instead" );
    }
  }
  this.notFound = function( req, res ){ $svr.sendText(res, 404, "Not found\n"); }
  this.sendText = function( res, stat, msg, ctype ){
    res.writeHead( stat, {"Content-Type": ((ctype)? ctype : "text/plain")} );
    res.end(msg);
  }
}

//---start http server
var server = http.createServer( new OrderFeesAPI().reqHandler );

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("server listening at", addr.address + ":" + addr.port);
});
