//4-7-2016 jchoy QuikNote, ScratchApp, RedButton, QuikLinks, AutoLink
//-----
function QuikNote( fn ){
	(function(t,c){t.c=c,t.c()})(this,FormHelper);
	this.fileName = "quiknote101.txt";
	this.start= function(parent, fn){
		if (fn) this.fileName = fn;
		var frm = this.addEl( "form", parent );
		this.addTa( frm, 10, 60, "clientTa", "" );
		this.addEl( "button", frm ).value="Save";
		this.addEl( "button", frm ).value="Load";
	 	this.prepForm( frm );
	}
	this.addTa= function( frm, rows, cols, name, val ){
		this.addEl( "textarea", frm ).rows= rows;
		this._.cols= cols;
		this._.form[name] = this._;
		this._.value= val
	}
	this.onButtonClick= function(){
		if (this.value=="Load")
		  this.form.clientTa.value = new FsoUtil().readFile( this.form.helper.fileName );
		if (this.value=="Save")
		  new FsoUtil().writeFile( this.form.helper.fileName, this.form.clientTa.value );
	}
}
//-----
function QuikLinks( fn ){
	(function(t,c){t.c=c,t.c()})(this,QuikNote);
	this.fileName = "quiklinks101.txt";
	this.start= function(parent, fn){
		if (fn) this.fileName = fn;
		this.addEl( "div", parent ).innerHTML = "loading...";
		this.asset= new FsoUtil().readFile( this.fileName );
		this.showPreview( this.asset+"", this._ );
	}
	this.showPreview= function(s, el){
		this.assetPrev = [s, el.innerHTML= ""][0];
		new AutoLink().start( s, el, this );
		new AutoSave().i0.start().addClient(new FavTrak().i0, "scoreCard", "favtrak.txt");
	}
	this.showEdit= function( el ){
		var frm = this.addEl( "form", el, el.innerHTML= "" );
		this.addTa( frm, 10, 60, "clientTa", this.assetPrev );
		this.addEl( "button", frm ).value="Preview";
		this.addEl( "button", frm ).value="Save";
	 	this.prepForm( frm );
	}
	this.onButtonClick= function(){
		if (this.value=="Preview")
		  this.form.helper.showPreview( this.form.clientTa.value, this.form.parentNode );
		if (this.value=="Save") 
		  new FsoUtil().writeFile( this.form.helper.fileName, this.form.clientTa.value );
		if (this.value=="Edit") this.form.helper.showEdit(this.form.parentNode);
	}
}
//-----
function AutoLink(){
	(function(t,c,a){t.c=c,t.c(a)})(this,FormHelper);
	var $ea;
	this.start= function( s, par, mgr ){
		this.massage(s, par);
		var frm= this.addEl( "form", par );
		this.addEl( "button", frm ).value="Edit";
		this.onButtonClick= mgr.onButtonClick;
		this.prepForm( frm );
		frm.helper= mgr;
	}
	this.massage= function( s, el ){
		for (var m in $ea=this.enumArray(s.split("\n"))){
			this._= new FavTrak().start( this.addEl("div", el), m, $ea[m].length );
			this.addEl("a", this._.parentNode).innerHTML = $ea[m];
			this._.href= $ea[m];
			this._.parentNode.style.marginTop= "6";
		}
	}
}
//-----
function FavTrak(){
	(function(t,c,a){t.c=c,t.c(a)})(this,FormHelper);
	(function(t,c,a){t.c=c,t.c(a)})(this,SingletonBob,"favTrak4145");
	this.hearts = ["&nbsp;&#9825;&nbsp;","&nbsp;&#9829;&nbsp;"]
	this.scoreCard= {};
	this.isDirty= false;
	var $t= this;
	this.start= function( par, id, len ){
		$t.addEl( "span", par ).onclick= $t.onIconClick;
		$t._.innerHTML = $t.i0.getIcon( $t._.asset_FavTrak= {id:id, len:len}, par );
		return $t._;
	}
	this.onIconClick= function(){
		(this._ = new FavTrak().i0).trakClick( this.asset_FavTrak );
		var res = this._.getIcon( this.asset_FavTrak, this.parentNode );
		this.innerHTML= res;
	}
	this.getIcon= function( asset, elForBg ){
		for (var m in this.scoreCard)
		  if (asset.id==m) {
			var res = ($t.scoreCard[m]==asset.len)? 1:0;
			if (elForBg) elForBg.style.backgroundColor= (res)? 'yellow':'transparent';
			return $t.hearts[res];
		  }
		if (elForBg) elForBg.style.backgroundColor= 'transparent';
		return $t.hearts[0];
	}
	this.trakClick= function( asset ){
		var found;
		for (var m in this.scoreCard)
			if (asset.id==m) found=m;
		if ((found) && (asset.len==this.scoreCard[found])) { delete this.scoreCard[found];
		} else this.scoreCard[asset.id]= asset.len;
		this.isDirty = true;
	}
}
//-----
function QuikHtml( fn ){
	(function(t,c){t.c=c,t.c()})(this,QuikLinks);
	this.fileName = "quikhtml101.txt";
	this.showPreview= function(s, el){
		if (s.indexOf("beta-danger")==0) return this.specialTest();
		this.assetPrev = [s, el.innerHTML= ""][0];
		this._=new AutoLink();
		this._.massage= function(s,el){el.innerHTML=s}
		this._.start( s, el, this );
	}
	this.specialTest= function(){
		//alert( JSON.stringify( {f:8, g:'plo'} ) );
		//var win= showModelessDialog("foo",window,"dialogwidth:600px");
		//win.document.innerHTML= '<HTA /><head><title>Sandbox</title><meta http-equiv="x-ua-compatible" content="ie=10"></head>';
		//alert(win.document.innerHTML);
	}
}
//----- textarea
function ScratchApp(){
	(function(t,c,a){t.c=c,t.c(a)})(this,DivApp);
	this.start= function(parent, placeHolder){
		this.addEl( "textarea", parent ).rows=10;
		this._.cols=70;
	}
}
//-----
function AutoSave(){
	(function(t,c,a){t.c=c,t.c(a)})(this,DivApp);
	(function(t,c,a){t.c=c,t.c(a)})(this,SingletonBob);
	this.checkInterval = 15000;	//ms
	this.checklist = [];
	var $t = this;
	var $ea;
	this.start= function(){
		this.enabled = true;
		this.check();
		return this;
	}
	this.addClient= function( inst, propName, fileName ){
		this.checklist.push( {inst:inst, propName:propName, fileName:fileName} );
	}
	this.check= function(){
		if (!this.enabled) return;
		for (var m in $ea=this.enumArray(this.checklist))
			if ($ea[m].inst.isDirty) this.saveToFile( $ea[m] );
		setTimeout( function(){$t.check()}, this.checkInterval );
	}
	this.saveToFile= function( pkg ){
		var payload = JSON.stringify( pkg.inst[pkg.propName] );
		new FsoUtil().writeFile( pkg.fileName, payload );
		pkg.inst.isDirty= false;
	}
}
//-----
function RedButton(){
	this.start= function( s ){
		if (s=="Folder") return window.open(".");
		if (s=="Reload") location.reload(true);
		if (s=="Close") return window.close();
		var lpn = (location.pathname).split(/[\/\\]/).pop();
		if (s=="Spawn2") return showModelessDialog(lpn,window,"dialogwidth:1100px");
		if (s=="Spawn") {
			new FsoUtil().runCmd( lpn );
			window.close();
		}
	}
}
//-----
function LogApp(){
	(function(t,c){t.c=c,t.c()})(this,DivApp);
	this.start= function(parent){
		this.par= parent;
		this.notifyCB( "Log Messages" );
		new NotificationBob().i0.subscribe(this);
	}
	this.notifyCB= function(s, channel){
		this.addEl( "div", this.par).innerHTML= s;
	}
	
}


