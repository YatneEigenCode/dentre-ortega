//5-19-2016 jchoy v0.252 sendPkgUrl
//5-18-2016 jchoy v0.117 js604.appTool
//-----
SnAppFdn= function(){
  this.inherit= function( inst, base, a, b, c, d, e ){
    inst.cstr= base;  inst.cstr(a, b, c, d, e);
  }
  this.cgi= function(k,def,qy){
    var at=(qy+"").split(new RegExp("[\&\?]"+k+"="));
    return (at.length==1)?def:at[1].split("&")[0];
  }
  this.addEl= function( tag, par ){
	if (!par) par= document.body;
	return this._=par.appendChild( document.createElement(tag) );
  }
  this.exposeClassNames= function(obj){
    for (var m in obj){
      window[this._=m.charAt(0).toUpperCase()+m.substr(1)]= obj[m].constructor;
      console.log( this._+" class name is now defined.");
    } //TODO: check for native code, window/global
  }
}
SnAppLoader= function(){
  js604.snAppFdn.inherit( this, js604.snAppFdn.constructor );
  var $t= this;
  this.sendPkgUrl= "/ts/set/?i=";
  this.setNotification= function($fcn){
    $t.chainNotify= null;
    try{ $t.chainNotify= _n } catch(e) {};
    _n= function(){ _n=$t.chainNotify; $fcn(); setTimeout('if(_n)_n()',100) }
  }
  this.loadJs= function($s){
    var hd0= document.getElementsByTagName('head')[0];
    try {$t.pkgBefore= pkg} catch(e) {}
    this.setNotification( function(){ $t.checkPkg($s) } );
    if ($s) this.addEl('script', hd0 ).src='/ts/text/?i='+$s; 
  }
  this.checkPkg= function($s){
    if ($t.pkgBefore == pkg) return $t.setNotification( function(){ $t.checkPkg($s) } );
    $t.pkgBefore=pkg;
    $t.gotNewPkg($s);
  }
  this.gotNewPkg= function(s){  //override this
    pkg.starter.start();  //or specific action based on s
  }
  this.sendPkg= function(json, num){
    var im=new Image(), res= "pkg="+ JSON.stringify(json) +"\nif(_n)_n()";
    im.src= this.sendPkgUrl +num +"&data="+escape(res);
  }
}
//-----
Counter= function(){
    this.add= function(key){
      if (!this.data[key]) this.data[key]=0;
      this.data[key]++;
    }
    this.restart= function(){
      this.data= {};
      this.startTime = new Date();
    }
    this.count= function(key){
      return (this.data[key])? this.data[key] : 0;
    }
    this.elapsedTimeSecs= function(){
      return ((new Date()).valueOf()-this.startTime.valueOf())/1000;
    }
    this.restart();
}

//-----
SnApp= function(){
  js604.appTool.inherit( this, js604.appTool.constructor );
  this.start= function(){
    //this.addEl('div').innerHTML= 'start 604';
    console.log( 'start 604' );
    this.loadJs( this.cgi('js','',location) );
  }
}

js604=pkg={}
pkg.snAppFdn= new SnAppFdn();  //*pkg*
pkg.appTool= new SnAppLoader();  //*pkg*
pkg.counter= new Counter();  //*pkg*
pkg.starter= new SnApp();  //*pkg*
pkg.appTool.exposeClassNames( pkg );


//if(_n)_n();