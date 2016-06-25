//5-16-2016 jchoy v1.231 - mapPathsToFN
//5-8-2016 jchoy v1.211 textStore.js - TextStore js on server side: TextStoreCgi, BumWebApp, TextStoreWebApp
//TextStore works with express, TextSstoreCgi works with node-router, TextStoreWebApp works with http
//TODO: TextStoreExpressApp to work with express
//-----
TextStore = function(){
  this.assets= {}
  this.cfg= {};
  this.save= function(i,data){
    this.assets['t'+i]= data;
  }
  this.get= function(i){ return this.assets['t'+i]; }
  this.cgi= function(k,def,qy){
	  var at=(qy+"").split(new RegExp("[\&\?]"+k+"=")); 
	  return (at.length==1)?def:at[1].split("&")[0];
  }
  this.ucgi= function(k,def,qy){ return unescape(this.cgi(k,def,qy)); }
  this.getPayload= function(){	return JSON.stringify( this.assets ); }
  this.getFilePath= function(){ return this.cfg.dataFilePath; }
  this.config= function(cfg){  for (var m in cfg) this.cfg[m] = cfg[m]; }
  this.initAssets= function(payloadJson){ 
    this.assets = JSON.parse(payloadJson);  
    var i=0;
    for (var m in this.assets) i++;
    console.log( "Assets initialized with " +i +" items" );
  }
}
//-----
TextStoreCgi= function(){
  (function(t,c){t.c=c;t.c()})(this,TextStore);
  this.tsSave= this.save;
  this.tsGet= this.get;
  this.save= function(qy){
    this.tsSave( this._=this.cgi('i','9',qy), this.ucgi('data','',qy) );
  }
  this.get= function(qy){
    return this.tsGet( this._=this.cgi('i','9',qy) );
  }
  this.startServer= function( server ){
    var $t= this;
    server.get("/ts/set/", function (request, response) {
      $t.save( request.url );
      response.simpleText(200, "Saved to "+$t._);
    });
    server.get("/ts/text/", function (request, response) {
      response.simpleText(200, ""+$t.get(request.url));
    });
  }
}
//----- works with http orig package
XBumWebApp= function(){
  var $svr= this;
  this.pathBums= new Array();
  this.reqHandler = function( req, res ){
    $svr.parsePath( req.url )[1](req, res);
  }
  this.notFound = function( req, res ){ $svr.sendText(res, 404, "Not found\n"); }
  this.sendText = function( res, stat, msg, ctype ){
    res.writeHead( stat, {"Content-Type": ((ctype)? ctype : "text/plain")} );
    res.end(msg);
  }
  this.parsePath = function( url ){
    var urlf = url.split('?',2)[0];
    for (var i=0,at=this.pathBums; i<at.length; i++)
      if (urlf==at[i][0]) return at[i];
    return ['',this.notFound];
  }
  this.mapPathsToFN = function( aPF, getFileFcn ){
    for (var i=0; i<aPF.length; i++){
      var $filename= at[1];
      var fcn= function(){  getFileFcn($filename);  }
      this.pathBums.push( [at[0], fcn] );
    }
  }
  this.addGetPath = function( path, fcn ){
    this.pathBums.push([path,fcn]);
  }
}
//-----
TextStoreWebApp= function(){
  (function(t,c){t.c=c;t.c()})(this,TextStoreCgi);
  (function(t,c){t.c=c;t.c()})(this,BumWebApp);
  var $t=this;
  this.addGetPath("/ts/set/", function (request, response) {
      $t.save( request.url );
      $t.sendText( response, 200, "Saved to "+$t._);
      console.log( new Date()+" /ts/set "+$t._ );
  });
  this.addGetPath("/ts/text/", function (request, response) {
      $t.sendText( response, 200, ""+$t.get(request.url));
      console.log( new Date()+" /ts/text "+$t._ );
  });
}
