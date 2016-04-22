//4-22-2016 JChoy FsoUtil.js v0.125 fixed out of sequence bug
//4-11-2016 JChoy FsoUtil.js v0.113 VfsAuto instead of detect, moved code to Notif.js
//-----
function DifJak(){
	this.check= function(s){
		var res= (this.payload != s);
		return [res, this.payload=s][0];
	}
}
function TimeJak(){
	this.lastTimestamp= new Date("Jan 1, 2000");
	this.elapsed= function(){
		var ltv= this.lastTimestamp.valueOf();
		return (this.lastTimestamp=new Date()).valueOf()-ltv;
	}
}
//-----
function FsBridge(maFs){
	this.meta= {};
	if (maFs) this.maFs= maFs;
	var $t = this;
	this.getOrAddMember= function( aa, k, def ){
		return (aa[k])? aa[k] : (aa[k]=def);
	}
	this.getMeta= function(k){
		return this.getOrAddMember( this.meta, k, 
			{name2: this.validName(k), df:new DifJak()} );
	}
	this.validName= function( name ){
		return name.replace( /\//g, "_" );
	}
	$t.readFile= function(fn, cb){ if ($t.maFs) return $t.maFs.readFile(fn, cb) }
	$t.writeFile= function(fn,s){ if ($t.maFs) $t.maFs.writeFile( fn, s ) }
}
//-----
function Vfs(){
	(function(t,c,a){t.c=c,t.c(a)})(this,VfsWb, new FsBridge() );
}
//-----
function VfsWob(){
	(function(t,c,a){t.c=c,t.c(a)})(this,SingletonBob,"VfsWob295");
	this.fstab= {dat:{},meta:{}};
	this.readFile= this.readFile_= function(fn, cb){
		var res= this.fstab.dat[fn];
		if (cb && res) cb(res);
		return res;
	}
	this.writeFile= function(fn, s){
		this.fstab.dat[fn] = s;
		this.fstab.meta[fn] = {size:s.length,dateModified:new Date()};
	}
}
//-----
function VfsWb( bridge ){
	(function(t,c,a){t.c=c,t.c(a)})(this,VfsWob);
	(function(t,c,a){t.c=c,t.c(a)})(this,SingletonBob,"Vfs442");
	var $t= this;
	$t.cfg= {interval: 60000, tj:new TimeJak(), lastFn:""};
	if (bridge) $t.cfg.fsBridge= bridge;
	this.readFile= function(fn, cb){
		var res= this.readFile_(fn, cb);
		if (res) return res;
		this.fstab.meta[fn]= {size:0,dateModified:null,cb:cb};
		var $fn= fn;
		this.fsBridgeRead(fn, function(s){$t.gotFileA(s, $fn)} )
	}
	this.gotFileA= function( s, fn ){
		log.log( "VfsWb.gotFileA "+fn+"  "+s.length );
		if (!fn) return;
		try{ this.fstab.meta[fn].cb(s); } 
			catch(e) { log.log("VfsWb.gotFileA "+e.message)}
		$t.cfg.fsBridge.getMeta(fn).df.check(s);
		this.writeFile(fn, s);
	}
	this.fsBridgeRead= function(fn, cb){
		if (!$t.cfg.fsBridge) return;
		if (($t.cfg.lastFn == fn) || ($t.cfg.tj.elapsed()<9999)) return;
		$t.cfg.fsBridge.readFile($t.cfg.fsBridge.getMeta(fn).name2, cb);
	}
	this.check= function(){
		if (!$t.cfg.fsBridge) return;
		for (var m in this.fstab.meta){
			var cr= [$t.fstab.dat[m], $t.cfg.fsBridge.getMeta(m)];
			if (cr[1].df.check( cr[0] ))
				$t.cfg.fsBridge.writeFile( cr[1].name2, cr[0] );
		}
		setTimeout( function(){ $t.check() }, $t.interval );
	}
	this.check();
}

//----- backward compatibility
function FsoUtil(){
	//damodes: txt, json*, base64, encr
	(function(t,c,a){t.c=c,t.c(a)})(this,Vfs);
	//hta*, ts, cloud, lan, ms-big, paw, msql
}

//-----
function FsoUtil_htadir(fldr){
	this.fldr = (fldr)? (fldr+"/") : "data/"; 
	this.fsu = new FsoUtil_hta_nodir();
	var $t=this;
	$t.readFile= function(fn, cb){ return $t.fsu.readFile($t.fldr+fn, cb) }
	$t.writeFile= function(fn,s){ $t.fsu.writeFile( $t.fldr+fn, s ) }
	this.runCmd= function( cmd ){ $t.fsu.wsh.run( cmd );	}
}
FsoUtil_hta= FsoUtil_htadir;
//-----
function FsoUtil_hta_nodir(){
	(function(t,c,a){t.c=c,t.c(a)})(this,SingletonBob,"fsoUtilHta429651");
	this.fso= new ActiveXObject( "Scripting.FileSystemObject" );
	this.wsh= new ActiveXObject( "WScript.Shell" );
	var $t= this;
	this.jLoaders= [];
	this.readFile= function(fn, cb){
		var fi= $t.fso.openTextFile(fn,1,true);
		this.cb= cb;
		try { eval(fi.readAll()); } catch (e) {alert(e.message);}
		fi.close();
	}
	this.s= function(jo){ 
		if (this.cb) this.cb( jo.text );
		this.cb= null;
	}
	this.writeFile= function(fn, s){
		var fi= $t.fso.openTextFile(fn,2, true);
		if (fi) fi.write( this.stringify({text:s}) );
		fi.close();
	}
	this.stringify= function(obj){
	    var res= "if ({0}) {0}.s(".replace( /\{0\}/g, "_j");
	    return res +JSON.stringify(obj) +")";
	}
	this.runCmd= function( cmd ){	this.wsh.run( cmd );	}
	_j= this.i0;
}
//-----
function VfsAuto(){
	this.lookup= {hta:"FsoUtil_hta", client:"", ro:"FsoUtil_ro" };
	this.start= function(bfs){
		var bfsName= (this.lookup[bfs])? this.lookup[bfs] : bfs;
		var $bridgeMaFs= (bfsName)? new (window[bfsName])() : null;
		Vfs= function(){
		  (function(t,c,a){t.c=c,t.c(a)})(this,VfsWb, 
			new FsBridge($bridgeMaFs) );
		}
	}
}
//usage: VfsAuto().start("hta")
function Logger(){ this.log= function(s){ this.cache+= s+"\n" }; this.cache= ""; }
log= new Logger();
