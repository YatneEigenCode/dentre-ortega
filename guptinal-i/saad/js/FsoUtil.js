//4-9-2016 JChoy FsoUtil v0.251 Vfs, VfsWb, FsBridge
//3-8-2016 JChoy Sandbox.hta orig
//-----
function StubApp(){
	(function(t,c){t.c=c,t.c()})(this,DivApp);
	this.start= function(parent, placeHolder){
		this.addEl( "div", parent ).innerHTML= placeHolder;
	}
}
//----- Move DOM el
function DomMvApp(){
	(function(t,c){t.c=c,t.c()})(this,DivApp);
	this.start= function(parent, eid){
		var el= document.getElementById(eid);
		if (el) parent.insertBefore(el);
	}
}
//-----
function PortalsLayout(){
	(function(t,c){t.c=c,t.c()})(this,DivApp);
	this.portals= [];
	var $ea;
	var $d=document;
	this.cfg= {cols:2, cellCfg: {
		  width:"50%", height:200, bgColor:"#EEFFFF", vAlign:"top" 
	}}
	this.start= function(parent){
		this.addEl( "table", parent ).width="100%";
		this._.insertRow().parentNode.parentNode.portalsLayoutMgr = this;
		return [this._, this._.cellSpacing= "10"][0];
	}
	this.addPortal= function( pObj ){
		return [pObj, this.portals.push(pObj)][0];
	}
	this.getTable= function(){
		for (var m in $ea=this.enumArray($d.getElementsByTagName("table")))
			if ($ea[m].portalsLayoutMgr) return $ea[m];
		return new PortalsLayout().start($d.body);
	}
	this.getAvailCell= function(){
		var tbl= this.getTable();
		var row= tbl.rows[tbl.rows.length-1];
		var cel= (row.cells.length<2) ? row.insertCell():tbl.insertRow().insertCell();
		for (var m in this.cfg.cellCfg) cel[m]= this.cfg.cellCfg[m];
		this.addEl( "div", cel ).style.overflow= "hidden";
		this._.style.height= this.cfg.cellCfg.height;
		this._.style.width= "100%";
		var div=this.addEl( "div", this._);
		div.style.overflow= "scroll";
		div.style.width= "110%";
		div.style.height= this.cfg.cellCfg.height+20;
		return [div, cel.parentNode.portalsLayoutMgr=this][0];
	}
	this.getPortalsMgr= function(){
		return this.getTable().portalsLayoutMgr;
	}
}
//-----
function NotificationBob(){
	(function(t,c){t.c=c,t.c()})(this,DivApp);
	(function(t,c,a){t.c=c,t.c(a)})(this,SingletonBob,"notificationBob908");
	this.subscribers = new Array();
	this.notifyPeer= function(s, channel){
		for (var m in this.enumArray(this.subscribers))
			if (!this._[m]) {
				this.isMessy= true;
			} else if (this._[m].notifyCB) {
				this._[m].notifyCB(s, channel); 
			} 
	}
	this.subscribe= function( client, isBye ){
		for (var i=0,at=this.subscribers; (isBye) && (i<at.length); i++)
			  if (at[i]==client) at[i]= null;
		if (!isBye) this.subscribers.push( client );
	}
}
//-----
function SingletonBob(sm){
	this.singletonMark= (sm)? sm : "default9999";
	this.singPref= "singleton_";
	var $t= this;
	this.getSingleton= function( inst ){
		var spm = $t.singPref+$t.singletonMark;
		if (!window[spm]) window[spm] = (inst) ? inst : this;
		return window[spm];
	}
	this.i0= this.getSingleton(this);
}
//-----
function FormHelper(){
	(function(t,c){t.c=c,t.c()})(this,DivApp);
	var $t=this;
	this.start= function(){
		this.prepForm();
	}
	this.prepForm= function(form){
		if (!form){
		  for (var m in $t.enumArray(document.forms))
			this.prepForm($t._[m]);
		  return;
		}
		if (form.helper) return;
		form.helper= this;
		for (var m in $t.enumArray(form.elements) )
			this.prepButton( $t._[m] );
	}
	this.prepButton= function(btn){
		if (btn.type!="button") return;
		$t.addOn( btn, "click", this.onButtonClick );
		btn.style.margin = 3;
	}
	this.onButtonClick= this.noOp;		//override this
}
//-----
function DivApp(){
	var $t=this;
	var $d=document;
	this.addEl= function(tag, parent){
		$t._= $d.createElement(tag);
		if (parent) parent.appendChild($t._);
		return $t._;
	}
	this.enumArray= function(at){
		for (var res=$t._={},i=0; i<at.length; i++)
			res["item"+i]= at[i];
		return $t._=res;
	}
	this.addOn= function(el, evt, fcn){
		if (el.addEventListener){
			el.addEventListener( evt, fcn );
		} else {  el["on"+evt] = fcn; }
	}
	this.noOp= function(){}
}
//-----
function AnyPageApp(){
	(function(t,c){t.c=c,t.c()})(this,FormHelper);
	this.start= function(parent){
		this.prepForm(parent);
	}
	this.onButtonClick= function(){
		this.form.helper.addEl("div", this.form).innerHTML=this.value;
	}
}
//-----
function MyPageApp(){
	(function(t,c){t.c=c,t.c()})(this, AnyPageApp);
	this.onButtonClick= function(){
		if (this.value=="Go") this.form.helper.specialTest();
		if (this.value=="Test") {
			new NotificationBob().i0.notifyPeer(this.value);
		} else new RedButton().start( this.value );
		this.form.helper.addEl("div", this.form).innerHTML=this.value;
	}
	this.specialTest= function(){
		var plm= new PortalsLayout().getPortalsMgr();
		plm.addPortal( new QuikNote2().start(plm.getAvailCell(), "qn2.txt" ) );
	}
}
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
	$t.readFile= function(fn){ return $t.maFs.readFile(fn) }
	$t.writeFile= function(fn,s){ $t.maFs.writeFile( fn, s ) }
}
//-----
function Vfs(){
	(function(t,c,a){t.c=c,t.c(a)})(this,VfsWb, 
		new FsBridge(new FsoUtil_htadir("bbb")) );
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
		if (isDo) this.fstab.dat[fn]= $t.cfg.fsBridge.readFile(fn);
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

//-----
function FsoUtil(){
	//damodes: txt, json*, base64, encr
	(function(t,c,a){t.c=c,t.c(a)})(this,SingletonBob,"fsoUtil429");
	this.inherit= function(c,a){ this.cx=c; this.cx(a); }
	this.runCmd= this.noOp= function(){}
	this.inherit( FsoUtil_hta );  //hta*, ts, cloud, lan, ms-big, paw, msql
}
//-----asynchronous
/*
function FsoUtil_ajson(){
	this.readFile= function(fn, cb){
		this.cb= cb;	this.asyncGot( "N/A" );
	}
	this.writeFile= function(fn, s, cb){
		this.cb= cb;	this.asyncGot( "failed" );
	}
	this.asyncGot= function(s){
		this.payload= s;	this.cb(this);
	}
}
*/
//-----
function FsoUtil_htadir(fldr){
	this.fldr = (fldr)? (fldr+"/") : "fsu/"; 
	this.fsu = new FsoUtil_hta();
	var $t=this;
	$t.readFile= function(fn){ return $t.fsu.readFile($t.fldr+fn) }
	$t.writeFile= function(fn,s){ $t.fsu.writeFile( $t.fldr+fn, s ) }
}

//-----
function FsoUtil_hta(){
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

