//7-5-2016 jchoy v0.132 group, version/ping
//6–25-2016 jchoy v0.112 Relic - remote pseudo listener engine
//TODO: nonJson option for check-no
//-----
RelicReq = function( url, group ){
  this.url= url;
  this.token = ++RelicReq.lastToken;
  this.lifespanMs = 30000;
  this.group = group;
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
      return new Date().valueOf() > this.expiry.valueOf();
  }
  this.recTimestamp = new Date()
  this.setStatus( 'RECD' );
}
RelicReq.lastToken= 1000;

//-----
RelicEngine = function(){
  (function(t,c){t.c=c;t.c()})(this,TextStore);
  (function(t,c){t.c=c;t.c()})(this,BumWebApp);
  this.ver= 'v0.132';
  this.cliReqs= [];
  this.cfg= {maxReqs:5000};
  this.lastWorkTimestamp= new Date();
  //-----
  this.findReq= function(token){
    this.cleanUp();
    for (var i=0; i<this.cliReqs.length; i++)
      if (this.cliReqs[i].token==token) return this.cliReqs[i];
    return null;
  }
  this.cleanUp= function(){
    for (var i=0,at=this.cliReqs; i<at.length; i++)
      if (at[i].status=='DEL') {
        at[i]=at.pop();
      } else if (at[i].isExpired()) 
        at[i].setStatus('EXP');
  }
  this.sendRespErr= function( response, text, token ){
      this.sendRespMsg( response, text, token, 9 );
  }
  this.sendRespMsg= function( response, text, token, erCd ){
      var pkg= {text:text, token:token, errCode: ((erCd)? erCd:0)};
      var res= 'pkg='+JSON.stringify(pkg) +"\n_n();"
      this.sendText( response, 200, res );
      console.log( text+": "+token );
  }
  this.ping= function( req, res ){
      var payload= this.cgi("payload","default",req.url);
      if (payload=="version") {
        this.sendRespMsg( res, this.ver, 'NA');
      } else
        this.sendRespMsg( res, "payload is "+payload, 'NA');
  }
  this.count= function( req, resp ){
    var res='', counts= {RECD:[], PROG:[], COMP:[], SHIP:[], EXP:[], DEL:[]};
    for (var i=0,at=this.cliReqs; i<at.length; i++)
      counts[at[i].status].push(at[i].token);
    for (var m in counts)    res+= m+'='+counts[m].length+' ';
    if (true) for (var m in counts) 
      if (counts[m].length <= 5){
        if (counts[m].length > 0) res+= '<br>\n'+m+': ';
        for (var i=0; i<counts[m].length; i++)
          res+= counts[m][i]+',';
      }
    this.sendRespMsg( resp, res, 'NA' );
  }
  //-----
  this.addRequest= function( req, res ){
    if (this.cliReqs.length < this.cfg.maxReqs) {
      var group= this.cgi( 'g','default',req.url );
      var relicReq = new RelicReq(req.url, group);
      this.cliReqs.push( relicReq );
      this.sendRespMsg( res, "request queued", relicReq.token );
    } else
      this.sendRespErr( res, "queue is full", "NA" );
    this.cleanUp();
  }
  this.getResponse= function( req, resp ){
    var token= this.cgi( "id", "-99", req.url );
    var item = this.findReq(token);
    if (!item) {
      this.sendRespErr( resp, "thread not found", token)
    } else if (item.relicResponse) {
      item.setStatus('SHIP');
      //send json response
      this.sendRespMsg( resp, item.relicResponse, item.token);
    } else {
      this.sendRespErr( resp, "no response yet", item.token)
    }
  }
  //-----
  this.startWork= function( req, resp ){
    var item, group= this.cgi( "g","default",req.url );
    for (var i=0,at=this.cliReqs; i<at.length; i++)
      if (at[i].status != 'RECD') {
        //ignore
      } else if (at[i].isExpired()) {
        at[i].setStatus('EXP');
      } else if (at[i].group != group) {
        //ignore
      } else {
        item= at[i];
        this.sendRespMsg( resp, item.url, item.token);
        item.setStatus('PROG');
        return;
      }
    this.sendRespErr( resp, "no reqs to work on", "NA")

  }
  this.compWork= function( req, htres ){
    var token= this.cgi( "id", "99", req.url );
    var resp = this.cgi( "result", "unknown", req.url );
    var item= this.findReq(token);
    if (!item) {
      this.sendRespErr( htres, "thread not found", token)
    } else {
      item.setStatus('COMP');
      item.relicResponse = resp;
      //msg: response registered successfully
      this.sendRespMsg( htres, "response registered successfully", item.token);
    }
  }
  //-----
  this.startServer= function( server ){
    var $t= this;
    server.get("/relic/req", function (request, response) {
      $t.addRequest( request, response );
    });
    server.get("/relic/check", function (request, response) {
      $t.getResponse( request, response );
    });
    server.get("/relic/work", function (request, response) {
      $t.startWork(request, response);
    });
    server.get("/relic/comp", function (request, response) {
      $t.compWork(request, response);
    });
    server.get("/ping", function (request, response) {
      $t.ping(request, response);
    });
    server.get("/relic/count", function (request, response) {
      $t.count(request, response);
    });
  }
}
