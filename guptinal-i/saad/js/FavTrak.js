//4-15-2016 jchoy blank space signals plain html
//https://raw.githubusercontent.com/douglascrockford/JSON-js/master/json2.js
//JsonLoader is in ts2326
//-----
function AutoLink(){
	(function(t,c,a){t.c=c,t.c(a)})(this,FormHelper);
	var $ea, $nona;
	this.start= function( s, par, mgr ){
		this.massage(s, par);
		var frm= this.addEl( "form", par );
		this.addEl( "button", frm ).value="Edit";
		this.onButtonClick= mgr.onButtonClick;
		this.prepForm( frm );
		frm.helper= mgr;
	}
	this.massage= function( s, el ){
		for (var m in $ea=this.enumArray(s.split("\n")))
		  if ($ea[m].charAt(0)==" "){
			($nona=(this._==$nona)? $nona:this.addEl("div",el)).innerHTML+= $ea[m].replace("<>","<p>");
		  } else {
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
	this.isDirty= false;	this.scoreCard= {};
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
		var res=0;
		for (var m in this.scoreCard)
		  if (asset.id==m) res=($t.scoreCard[m]==asset.len)? 1:0;
		return [$t.hearts[res],this.setBg(elForBg, res)][0];
	}
	this.setBg= function( el, isF ){
		if (el) el.style.backgroundColor= (isF)? 'yellow':'transparent';
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
			new FsoUtil_hta().runCmd( lpn );
			window.close();
		}
	}
}
