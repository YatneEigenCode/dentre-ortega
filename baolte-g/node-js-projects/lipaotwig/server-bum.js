//5-17-2016 jchoy v0.315 BumWebApp.mapPathsToFN()
//5-8-2916 jchoy server-bum.js - to use with bare nodejs on android ice cold server
var http = require('http');
require( './js/TextStore.js' );
require( './js/BumWebApp.js' );
var bum = new TextStoreWebApp();
var server = http.createServer(bum.reqHandler);
var fs= require('fs');

bum.config( {dataFilePath:"writedata/ts-payload.txt"} );
bum.initAssets( fs.readFileSync(bum.getFilePath()) );
bum.addGetPath( '/commit/', function(req, res){
    fs.writeFileSync( bum.getFilePath(), bum.getPayload() );
    bum.sendText( res, 200, "Saved assets to  "+bum.getFilePath() );
    console.log( new Date() +" Saved assets to "+bum.getFilePath() );
})

bum.mapPathsToFN( [
     ['/ts',            'pub_html/textStore.htm']
    ,['/helpdev.txt',   'pub_html/']
    ,['/RecentList.js', 'pub_html/js/']
    ,['/ok88.element.base.js',  'pub_html/js/']
//    ,['/twigbud.htm',   'pub_html/']
    ], 
    function(fn){ return fs.readFileSync(fn); }
)

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Bum server listening at", addr.address + ":" + addr.port);
});
