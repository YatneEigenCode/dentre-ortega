//3-21-08  JKC v0.51 urlfile (with long urls)
//3-21-08  JKC v0.52 src in DxpSimple.js
//3-22-08  JKC v0.53 progId; delay hideDetail; TimeTier
//4-22-08  JKC v0.54 fix bug in PulsePanel.ClientColor

function PulsePanel( url, cell ){
	this.origText = (cell)? cell.innerHTML : "";
	this.url = url;
	this.cell = cell;
	this.cgi = function(k,def,qy){
		var at=(qy+"").split(new RegExp("[\&\?]"+k+"=")); return (at.length==1)?def:at[1].split("&")[0];
	}
	this.cgii = function( nm, def, qs ){
		//case-insensitive cgi
		var res = this.cgi( nm, def, qs );
		if (res==def) res = this.cgi (nm.toUpperCase(), def, qs);
		if (res==def) res = this.cgi (nm.toLowerCase(), def, qs);
		if (res==def) res = this.cgi (nm, def, qs);
		return unescape(res.replace(/\+/g,' '));
	}
	this.setId = function(){var nm="";for (var i=0; (window[nm="o"+i]); i++){} window[nm]=this; return nm; }
	this.setLinkText = function( s ){
		var at= "innerHTML,innerText".split(",");
		for (var i=0; i<at.length; i++)
		  if (typeof(this.link[at[i]]) != "undefined") this.link[at[i]]= s;
	}
	this.onmouseover= function(){ 
		this.master.detailDiv.style.display = "block";
		this.master.isShowDetail = true;
		this.master.isBlockWebGet = false;
	}
	this.onmouseout = function(){ 
		this.master.isShowDetail = false; 
		setTimeout( this.master.progId +".hideDetail()", 5000 );
		this.master.link.style.backgroundColor = "";
	}
	this.hideDetail = function(){
		if (!this.isShowDetail) this.detailDiv.style.display = "none";
	}
	this.createEl = function( tag ){
		var res = document.createElement( tag );
		for (var i=1; i<arguments.length; i++)
			res[arguments[i][0]] = arguments[i][1];
		return res;
	}
	this.init = function(){
		if (this.cell == null) return;
		this.cell.innerHTML = "";
		this.link = this.createEl( "a", ["master",this], ["href",this.url]
		  , ["onmouseover",this.onmouseover], ["onmouseout",this.onmouseout] );
		this.link.innerHTML  ="loading..." +this.origText;
		var el = this.detailDiv = this.createEl( "div", ["innerHTML","..."] );
		baseAddon.mold( el.style, {display:"none", width:300, height:30, overflow:"auto"} );
		this.cell.appendChild( this.link );
		this.cell.appendChild( this.detailDiv );
		this.cell = null;
	}
	this.ClientUrlWriter = function(master){
		this.master = master;
		this.write = function(s){ this.master.link.href =s }
	}
	this.ClientTitleWriter = function(master){
		this.master = master;
		this.write = function(s){ this.master.link.innerHTML =s }
	}
	this.ClientColor = function(master){
		this.master = master;
		this.write = function(s){ 
			this.master.link.style.backgroundColor="yellow";
			this.master.isBlockWebGet = true;
			this.master.toms.reset();
		}
	}
	this.ClientDetailWriter = function(master){
		this.master = master;
		this.write = function(s){ this.master.detailDiv.innerHTML =s }
	}
	this.pulse = function(){
		if (!this.writer) {
		  this.toms = new TimeTier( 8*3600000, 60000, 600000 );
		  this.progId = this.setId();
		  this.writer = new SplitWriter(
			new this.ClientUrlWriter(this),
			new TitleExtractor( new this.ClientTitleWriter(this) ),
			new ChangeCatcher( new this.ClientColor(this) ),
			new TextExtractor( new this.ClientDetailWriter(this) )
		  )
		  this.dxp = new DxpSimple( this.writer );
		  this.dxp.phpUrl = "http://rip.okdaily.com/mad/scrape2json.php";
		}
		//todo: stop updates if not acknowledged or slow if >8h
		if (!this.isBlockWebGet) this.dxp.webGet( this.url );
		setTimeout( this.progId +".pulse()", this.toms.get() );
	}
	this.init();
}
pulsePanel = new PulsePanel();
function TimeTier( t, v0, v1 ){
	//if elapase < t mss, v0 else v1
	this.tier = t;
	this.vals = [v0, v1];
	this.reset = function(){
		this.timeMark = (new Date()).valueOf();
	}
	this.get = function(){
		var now = (new Date()).valueOf();
		return this.vals[ (now-this.timeMark<this.tier)? 0:1 ];
	}
	this.reset();
}
function TitleExtractor( writer ){
	baseAddon.mold( this, pulsePanel );
	this.writer = writer;
	this.write = function(s){
		this.writer.write( this.cgii( "title", "Untitled", s ) );
	}
}
function TextExtractor( writer ){	//cq apps
	baseAddon.mold( this, pulsePanel );
	this.writer = writer;
	this.write = function(s){
		var res = this.cgi( "row1", "", s );
		if (res.substring(0,3)=="cfg") res = this.cgi( "row2", "", s );
		res = res || this.cgi( "Summary", "", s );
		res = res || this.cgi( "_Summary", "", s );
		res = res || this.cgi( "_text", "", s );
		res = res || this.cgi( "_Message", "", s );
		if (res) this.writer.write( unescape(res).split("^^")[0] );
		//else this.writer.write(s);  //need delay in mouseout to be useful
	}
}
function ChangeCatcher( writer ){
	baseAddon.mold( this, pulsePanel );
	this.writer = writer;
	this.prev = null;
	this.write = function(s){
		if (this.prev == null) this.prev=s;
		if (this.prev == s) return;
		this.writer.write( this.prev=s );
	}
}
function SplitWriter(){
	this.writers = new Array(arguments.length);
	this.write = function(s){
		for (var i=0; i<this.writers.length; i++) this.writers[i].write(s);
	}
	for (var i=0; i<this.writers.length; i++) this.writers[i] = arguments[i];
}

function Waffle(cfg0){
	//3-21-08
	this.ver = "0.53";
	baseAddon.mold( this, baseAddon );
	this.mold( this.cfg={}, (cfg0)? cfg0 : baseAddon.cfg );
	this.startRow = 1;
	this.addItemToCell = function( cell, row, col ){
		if (isNaN(cell.innerHTML)) return;
		//var c0 = this.getValueFromCgi( row, 0, "na");

		var urltpl = this.cfg.urltemplate;
		if (!urltpl) {
			if (row<this.startRow) { return cell.innerHTML = "";}
			urltpl  = "http://rip.okdaily.com/mad/textStore.php?f=text&i={0}";
		}
		var url = (urltpl+"").replace(/\{0\}/g, cell.innerHTML );
		var pp = new PulsePanel( url, cell );
		pp.pulse();
		return;
	}
}
waf = new Waffle( {key : "waffle"} );

waf.init();
//waf.nextAddon();


