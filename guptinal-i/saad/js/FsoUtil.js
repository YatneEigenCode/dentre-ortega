//4-11-2016 JChoy FsoUtil.js v0.113 VfsAuto instead of detect, moved code to Notif.js
//-----
function DifJak(){
	this.check= function(s){
		var res= (this.payload != s);
		return [res, this.payload=s][0];
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
	$t.readFile= function(fn){ if ($t.maFs) return $t.maFs.readFile(fn) }
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
	this.readFile= function(fn){
		var res= this.fstab.dat[fn];
		if (!res) { this.fsBridgeRead(fn); res= this.fstab.dat[fn]; }
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
	$t.cfg= {interval: 60000, lastTimestamp: new Date(), lastFn:""};
	if (bridge) $t.cfg.fsBridge= bridge;
	this.fsBridgeRead= function(fn){
		if (!$t.cfg.fsBridge) return;
		var isDo = ($t.cfg.lastFn != fn);
		isDo = isDo || (new Date().valueOf()-$t.cfg.lastTimestamp.valueOf()>5000)
		if (isDo)
		  this.fstab.dat[$t.cfg.lastFn=fn]= $t.cfg.fsBridge.readFile($t.cfg.fsBridge.getMeta(fn).name2);
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
	//(function(t,c,a){t.c=c,t.c(a)})(this,FsoUtil_hta);
	//hta*, ts, cloud, lan, ms-big, paw, msql
}

//-----
function FsoUtil_htadir(fldr){
	this.fldr = (fldr)? (fldr+"/") : "fsu/"; 
	this.fsu = new FsoUtil_hta_nodir();
	var $t=this;
	$t.readFile= function(fn){ return $t.fsu.readFile($t.fldr+fn) }
	$t.writeFile= function(fn,s){ $t.fsu.writeFile( $t.fldr+fn, s ) }
	this.runCmd= function( cmd ){	this.fsu.wsh.run( cmd );	}
}
FsoUtil_hta= FsoUtil_htadir;
//-----
function FsoUtil_hta_nodir(){
	(function(t,c,a){t.c=c,t.c(a)})(this,SingletonBob,"fsoUtilHta429651");
	this.fso= new ActiveXObject( "Scripting.FileSystemObject" );
	this.wsh= new ActiveXObject( "WScript.Shell" );
	var $t= this;
	this.readFile= function(fn){
		var fi= $t.fso.openTextFile(fn,1,true);
		try { $t._= fi.readAll(); } catch (e) {}
		return [$t._, fi.close()][0];
	}
	this.writeFile= function(fn, s){
		var fi= $t.fso.openTextFile(fn,2, true);
		if (fi) fi.write(s);
		fi.close();
	}
	this.runCmd= function( cmd ){	this.wsh.run( cmd );	}
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
