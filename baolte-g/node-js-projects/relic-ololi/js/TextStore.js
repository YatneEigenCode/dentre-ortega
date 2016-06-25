//5-16-2016 jchoy v1.231 - mapPathsToFN
//5-8-2016 jchoy v1.211 textStore.js - TextStore js on server side: TextStoreCgi, BumWebApp, TextStoreWebApp
//TextStore works with express, TextSstoreCgi works with node-router, TextStoreWebApp works with http
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
