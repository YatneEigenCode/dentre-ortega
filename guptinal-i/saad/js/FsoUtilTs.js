//4-20-2016 JChoy FsoUtil_ts, TimeJak, VfsWb_asyncRo
//-----
function TimeJak(){
	this.lastCheck= new Date();
	this.defaultMs= 10000;
	this.elapsed= function(){
		var lastVal= this.lastCheck.valueOf();
		return (this.lastCheck=new Date()).valueOf()-lastVal;
	}
	this.check= function(ms){ if (!ms) ms= this.defaultMs; return this.elapsed()>ms; }
}
//-----
function VfsEtc(s){
	(function(t,c,a){t.c=c,t.c(a)})(this,VfsWob);
	this.writeFile( ".etc", s );
}
function RoCfg(){
	var payload= JSON.stringify( {readUrl:"ro/",writeUrl:"nul/"} );
	(function(t,c,a){t.c=c,t.c(a)})(this,VfsEtc, payload);
	(function(t,c,a){t.c=c,t.c(a)})(this,SingletonBob,"rocfg_54394");
	payload= atob("eyJ0c1VybCI6Imh0dHA6Ly9yaXAub2tkYWlseS5jb20vbWFkL3RleHRTdG9yZS5waHAifQ==");
	var jo= JSON.parse(payload);
	jo.readUrl = jo.tsUrl+"?f=text&i=";
	jo.writeUrl= jo.tsUrl+"?f=set&i=";
	this.writeFile( "tscfg", JSON.stringify(jo) );
}
//-----
function FsoUtil_ts(){
	(function(t,c,a){t.c=c,t.c(a)})(this,SingletonBob,"fsoUtil_ts259857924");
	var $t= this;
	new JsonLoader().global();
	this.fstab= {dat:{},meta:{}};
	this.gotFile= function( jo ){
		log.log("FsoUtil_ts.gotFile "+jo.jsonAjaxNum);
		this.fstab.dat[jo.jsonAjaxNum]= jo.text;
	}
	this.readFile= function(fn){ new JsonAjax().i0.webGet(fn, this, "gotFile"); }
	this.writeFile= function(fn, s){ new JsonAjax().webSave( fn, s ); }
}
//-----
function FsoUtil_ro(){
	(function(t,c,a){t.c=c,t.c(a)})(this,FsoUtil_ts);
	(function(t,c,a){t.c=c,t.c(a)})(this,SingletonBob,"fsoUtil_ro949857924");
	this.readFile= function(fn){ new JsonAjaxRo().i0.webGet(fn, this, "gotFile"); }
	this.writeFile= function(){}
}
//-----
function VfsWb_asyncTs( bridge ){
// vfs -> bridge -> vfs_asyncTs -> bridge -> fso_ts
// asynchronously load ts reads, using check loop
	if (!bridge) bridge = new FsBridge(new FsoUtil_ts().i0);
	(function(t,c,a){t.c=c,t.c(a)})(this,VfsWb,bridge);
	var $t= this;
	this.fsBridgeRead= function(fn){
		log.log("VfsWb_asyncTs.fsBridgeRead "+fn);
		this.fstab.dat[$t.cfg.lastFn=fn]= $t.cfg.fsBridge.readFile($t.cfg.fsBridge.getMeta(fn).name2);
		this.fstab.meta[fn]= {size:0,dateModified:null,isAsync:true};
		this.checkAsyncResults();
	}
	this.checkAsyncResults= function(){
		log.log("FsoUtil_ts.checkAsyncResults ");
		for (var m in $t.fstab.meta) if ($t.fstab.meta[m].isAsync)
			this.fsBridgeLateRead(m);
		for (var m in $t.fstab.meta) if ($t.fstab.meta[m].isAsync)
			return setTimeout( function(){ $t.checkAsyncResults() }, 2000 );
	}
	this.fsBridgeLateRead= function(fn){
		if (!$t.cfg.fsBridge) return;
		this.fstab.dat[fn] = $t.cfg.fsBridge.maFs.fstab.dat[fn];
		this.fstab.meta[fn].isAsync= (this.fstab.dat[fn])? false:true;
		this.cfg.fsBridge.getMeta(fn).df.check( this.fstab.dat[fn] );
	}
}
//-----
function VfsWb_asyncRo( bridge ){
	if (!bridge) bridge = new FsBridge(new FsoUtil_ro().i0);
	(function(t,c,a){t.c=c,t.c(a)})(this,VfsWb_asyncTs,bridge);
	this.check= function(){}
}
//-----
function JsonAjaxRo(){
	(function(t,c,a){t.c=c,t.c(a)})(this,JsonAjax);
	(function(t,c,a){t.c=c,t.c(a)})(this,SingletonBob,"JsonAjaxRo_9421716927");
	this.cfg= JSON.parse(new RoCfg().i0.readFile(".etc"));
}
//-----
function JsonAjax(){
	(function(t,c,a){t.c=c,t.c(a)})(this,DivApp);
	(function(t,c,a){t.c=c,t.c(a)})(this,SingletonBob,"JsonAjax_21716927");
	this.jLoaders= [];
	this.cfg= JSON.parse(new RoCfg().i0.readFile("tscfg"));
	this.s= function( jd ){
		if ((jd) && (this.jLoaders.length>0)) {
			var jn= this.jLoaders.shift();
			jn.jsonLoader.s( [jd, jd.jsonAjaxNum= jn.num][0] );
		}
		if (!jd) this.addEl("script", document.body).src= this.cfg.readUrl+ this.jLoaders[0].num;
	}
	this.webGet= function( num, client, method ){
		var jn = {jsonLoader:new JsonLoader(), num:num};
		this.jLoaders.push( [jn, jn.jsonLoader.subscribe( client, method )][0] );
		this.s();
	}
	this.webSave= function( fn, s ){
		var s= new JsonLoader().stringify( {text:s} );
		new Image().src= this.cfg.writeUrl+fn+"&data="+escape(s);
	}
	_j = this.i0;
}
//-----
function Logger(){
	this.vfs= new Vfs();
	this.cache= "";
	this.log= function(s){ this.cache+= s+"\n" }
	this.dump= function(){ console.log(this.cache); }
}
log= new Logger();
