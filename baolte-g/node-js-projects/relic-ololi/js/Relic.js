//6-25-2016 jchoy v0.114 tested
//6–25-2016 jchoy v0.112 Relic - remote pseudo listener engine

//-----
RelicReq = function( url ){
  this.url= url;
  this.token = ++RelicReq.lastToken;
  this.lifespanMs = 30000;
  this.group = 'default';
  this.relicResponse = null;
  this.status = 'RECD'; //PROG, COMP, SHIP, EXP, DEL
  this.setStatus = function( st ){
      if (this.status=='DEL') return;
      if ((st=='EXP') && (this.status=='EXP')) {
        this.status = 'DEL';
      } else this.status = st;
      this.expiry = new Date( new Date().valueOf() + this.lifespanMs );
  }
  this.isExpired = function(){
      return new Date().valueOf > this.expiry.valueOf();
  }
  this.recTimestamp = new Date()
  this.setStatus( 'RECD' );
}
RelicReq.lastToken= 1000;

Relic = function(){
  (function(t,c){t.c=c;t.c()})(this,TextStore);
  (function(t,c){t.c=c;t.c()})(this,BumWebApp);
  this.cfg= {};
  this.cliReqs= [];
  this.lastWorkTimestamp= new Date();
  //-----
  this.findReq= function(token){
    for (var i=0; i<this.cliReqs.length; i++)
      if (this.cliReqs[i].token= token) return this.cliReqs[i];
    return null;
  }
  this.sendRespMsg= function( response, text, token ){
      this.sendText( response, 200, text+": "+token );
      console.log( text+": "+token );
  }
  //-----
  this.addRequest= function( req, res ){
    var relicReq = new RelicReq(req.url);
    this.cliReqs.push( relicReq );
    for (var i=0,at=this.cliReqs; i<at.length; i++)
      if (at[i].status=='DEL') {
        at[i]=at.pop();
      } else if (at[i].isExpired()) 
        at[i].setStatus('EXP');
    this.sendRespMsg( res, "request queued", relicReq.token );
  }
  this.getResponse= function( req, resp ){
    var token= this.cgi( "id", "99", req.url );
    var item = this.findReq(token);
    if (!item) {
      this.sendRespMsg( resp, "thread not found", token)
    } else if (item.relicResponse) {
      item.setStatus('SHIP');
      //send json response
      this.sendText( resp, 200, ""+item.relicResponse);
    }
  }
  //-----
  this.startWork= function( req, resp ){
    var item;
    for (var i=0,at=this.cliReqs; i<at.length; i++)
      if (at[i].status != 'RECD') {
        //ignore
      } else if (at[i].isExpired()) {
        at[i].setStatus('EXP');
      } else {
        item= at[i];
        this.sendRespMsg( resp, item.url, item.token);
        item.setStatus('PROG');
        i= at.length;
      }
  }
  this.compWork= function( req, htres ){
    var token= this.cgi( "id", "99", req.url );
    var resp = this.cgi( "result", "unknown", req.url );
    var item= this.findReq(token);
    if (!item) {
      //thread not found
    } else {
      item.setStatus('COMP');
      item.relicResponse = resp;
      //msg: response registered successfully
      this.sendRespMsg( htres, "response registered successfully", token);
    }
  }
  //-----
  this.startServer= function( server ){
    var $t= this;
    server.get("/relic/req", function (request, response) {
      $t.addRequest( request, response );
      console.log( "addRequest "+request.url );
    });
    server.get("/relic/check", function (request, response) {
      $t.getResponse( request, response );
      console.log( "getResponse "+request.url );
    });
    server.get("/relic/work", function (request, response) {
      $t.startWork(request, response);
      console.log( "startWork "+request.url );
    });
    server.get("/relic/comp", function (request, response) {
      $t.compWork(request, response);
      console.log( "compWork "+request.url );
    });
  }
}
