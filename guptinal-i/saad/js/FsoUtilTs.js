//4-22-2016 JChoy fixed out of sequence bug
//4-20-2016 JChoy FsoUtil_ts, TimeJak, VfsWb_asyncRo
//-----
function FsoUtil_ts(){
	(function(t,c,a){t.c=c,t.c(a)})(this,SingletonBob,"fsoUtil_ts259857924");
	var $t= this;
	this.fstab= {dat:{},meta:{}};
	this.ajax= new JsonAjax().i0;
	this.gotFileA= function( jo ){
		log.log("FsoUtil_ts.gotFileA "+jo.jsonAjaxNum);
		var cb= this.fstab.meta[jo.jsonAjaxNum].cb;
		if (cb) cb(jo.text);
	}
	this.readFile= function(fn, cb){
		log.log("FsoUtil_ts.readFile "+fn);
		this.fstab.meta[fn]= {size:0,dateModified:null,cb:cb};
		this.ajax.webGetCB(fn, function(o){$t.gotFileA(o)} );
	}
	this.writeFile= function(fn, s){ new JsonAjax().webSave( fn, s ); }
}
//-----
function FsoUtil_ro(){
	(function(t,c,a){t.c=c,t.c(a)})(this,FsoUtil_ts);
	(function(t,c,a){t.c=c,t.c(a)})(this,SingletonBob,"fsoUtil_ro949857924");
	this.ajax= new JsonAjaxRo().i0;
	this.writeFile= function(){}
}

//-----
function VfsEtc(s){
	(function(t,c,a){t.c=c,t.c(a)})(this,VfsWob);
	this.writeFile( ".etc", s );
}
function RoCfg(){
	var payload= JSON.stringify( {readUrl:"data/",writeUrl:"nul/"} );
	(function(t,c,a){t.c=c,t.c(a)})(this,VfsEtc, payload);
	(function(t,c,a){t.c=c,t.c(a)})(this,SingletonBob,"rocfg_54394");
	payload= atob("eyJ0c1VybCI6Imh0dHA6Ly9yaXAub2tkYWlseS5jb20vbWFkL3RleHRTdG9yZS5waHAifQ==");
	var jo= JSON.parse(payload);
	jo.readUrl = jo.tsUrl+"?f=text&i=";
	jo.writeUrl= jo.tsUrl+"?f=set&i=";
	this.writeFile( "tscfg", JSON.stringify(jo) );
}
//-----
function JsonAjaxRo(){
	(function(t,c,a){t.c=c,t.c(a)})(this,JsonAjax);
	(function(t,c,a){t.c=c,t.c(a)})(this,SingletonBob,"JsonAjaxRo_9421716927");
	_j = this.i0;
	this.cfg= JSON.parse(new RoCfg().i0.readFile(".etc"));
}
//-----
function JsonAjax(){
	(function(t,c,a){t.c=c,t.c(a)})(this,DivApp);
	(function(t,c,a){t.c=c,t.c(a)})(this,SingletonBob,"JsonAjax_21716927");
	this.jLoaders= [];
	this.globalName= "_j";
	this.cfg= JSON.parse(new RoCfg().i0.readFile("tscfg"));
	var $t=this;
	this.s= function( jd ){
		var tjn= this.jLoaders[this.jLoaders.length-1].num;
		log.log("JsonAjax.s "+this.singletonMark+" "+$t.jLoaders.length+" "+((jd)?9:("8 "+tjn)) );
		if ((jd) && ($t.jLoaders.length>0)) {
			var jn= $t.jLoaders.shift();
			log.log("JsonAjax.s jn.num "+jn.num+" len "+JSON.stringify(jd).length );
			jn.cb( [jd, jd.jsonAjaxNum= jn.num][0] );
		}
		if (!jd) this.addEl("script", document.body).src= this.cfg.readUrl+ tjn;
	}
	this.webGetCB= function( num, cb ){
		this.jLoaders.push( {cb:cb, num:num} );
		this.s();
	}
	this.webSave= function( fn, s ){
		var s= this.stringify( {text:s} );
		new Image().src= this.cfg.writeUrl+fn+"&data="+escape(s);
	}
	this.stringify= function(obj){
	    var res= "if ({0}) {0}.s(".replace( /\{0\}/g, this.globalName);
	    return res +JSON.stringify(obj) +")";
	}
	_j = this.i0;
}
function Logger(){ this.log= function(s){ this.cache+= s+"\n" }; this.cache= ""; }
log= new Logger();
