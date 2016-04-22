//4-21-2016 jchoy use async readFile
//4-10-2016 jchoy Check null before parsing fav data in QuikLinks
//https://raw.githubusercontent.com/douglascrockford/JSON-js/master/json2.js
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
		var $fm= this.form;
		if (this.value=="Load")
		  new FsoUtil().readFile( $fm.helper.fileName, function(s){$fm.clientTa.value=s} );
		if (this.value=="Save")
		  new FsoUtil().writeFile( this.form.helper.fileName, this.form.clientTa.value );
	}
}
//-----
function QuikLinks( fn ){
	(function(t,c){t.c=c,t.c()})(this,QuikNote);
	this.fileName = "quiklinks101.txt";
	var $t=this;
	this.start= function(parent, fn){
		if (fn) this.fileName = fn;
		this.addEl( "div", parent ).innerHTML = "loading...";
		var $div= $t._
		new FsoUtil().readFile( this.fileName, function(s){ $t.gotAsset(s,1,$div) } );
	}
	this.gotAsset= function(s,cd,div){
		if (cd==1) {
			this.asset= s;
		this.favUtil= ["{}", new FavTrak().i0];	//TODO: troubleshoot
		this.showPreview( this.asset+"", div );
			//new FsoUtil().readFile( "data/favtrak.txt", function(s){ $t.gotAsset(s,2,div) } );
		} else if (cd==2) {
			this.favUtil= [s, new FavTrak().i0];
			this.showPreview( this.asset+"", div );
		}
	}
	this.showPreview= function(s, el){
		this.assetPrev = [s, el.innerHTML= ""][0];
		var fav = this.favUtil;
		if (fav[0]) fav[1].scoreCard= JSON.parse( fav[0] );
		new AutoLink().start( s, el, this );
		new AutoSave().i0.start().addClient(fav[1], "scoreCard", "data/favtrak.txt");
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
