//5-17-2016 jchoy v1.232 - BumWebApp.js mapPathsToFN
//Webapp works with http

BumWebApp= function(){
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
  this.map1PathToFN = function( $fp, $fcnReadFile, $fn ){
      var ext= $fn.split('.').pop();
      var $ctype= ((ext=='htm') || (ext=='html'))? "text/html" : "text/plain";
      var fcn= function(req,res){  
        console.log( new Date()+ ' '+ req.url+ '->'+$fn );
        $svr.sendText( res, 200, $fcnReadFile($fn), $ctype );
      }
      this.pathBums.push( [$fp, fcn] );
  }
  this.mapPathsToFN = function( aPF, fcnReadFile ){
    for (var i=0; i<aPF.length; i++){
      var filename= aPF[i][1];
      if (filename.substr(-1)=='/') filename+= aPF[i][0];
      this.map1PathToFN( aPF[i][0], fcnReadFile, filename )
    }
  }
  this.addGetPath = function( path, fcn ){
    this.pathBums.push([path,fcn]);
  }
}
