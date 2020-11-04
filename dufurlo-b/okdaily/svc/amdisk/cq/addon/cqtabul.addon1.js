//2-26-08 JKC works with cqtabulofl
//2-26-08 JKC getFullYear; row and cell specific; use header cfg
//3-2-08  JKC v0.53 startRow, nextAddon
//3-21-08 JKC v0.54 baseAddon
//3-24-08 JKC v0.56 fix bug with row1/row10 mixup
baseAddon = {
	ver : "v0.56"
	, cfg : {key:":addon", label:"addon"}
	, getAttr: function(nm, def, obj){return (obj && obj.attributes && obj.attributes[nm])? obj.attributes[nm].value : def;}
	, thisTag: function(){
		var at= document.getElementsByTagName("script");
		return at[at.length-1];
	}
	, nextAddon : function(){
		var info = this.getAttr( "src", "none", this.thisTag() );
		var next = parseInt(info.replace( /.*(\d)\.js/, "$1"))+1;
		var tag = document.createElement( "script" );
		var tagsrc = info.replace( /(.*)\d(\.js)/, "$1"+next+"$2");
		if (tagsrc != info){
			tag.src= tagsrc;
			document.body.appendChild( tag );
		}
	}
	, startRow : 2
	, init : function(){
		this.findTableWithMoreRows(this.startRow);
		if (!this.table) return;
		this.findColumns();
		this.addItemsToTable();
	}
	, getCgi : function(){
		return (location+'').match(/\?.*/)[0].substring(1).split("&");
	}
	, getValueFromCgi : function( r,c,def ){
		for (var i=0,at=this.getCgi(); i<at.length; i++){
			var ap = at[i].split("=");
			if (ap[0]=="row"+r) {
				var ac = unescape(ap[1]).split("^^");
				if ((c<ac.length) && (ac[c]))return ac[c];
			}
		} return def;
	}
	, findColumns : function(){			//:checkbox
		for (var i=0,at=this.getCgi(); i<at.length; i++)
			if (at[i].match(/^row0\=/)){
				var av = this.row0 = unescape(at[i].substring(5)).split("^^");
				this.applyColumns = new Array(av.length);
				for (var j=0; j<av.length; j++)
				  if (av[j].indexOf(this.cfg.key)>0) 
					this.applyColumns[j]= true;
			}
	}
	, findTableWithMoreRows : function( n ){
		for (var i=0,at=document.getElementsByTagName("table"); i<at.length; i++)
			if (at[i].rows.length>n) return this.table = at[i];
	}
	, addItemsToTable : function(){
		for (var i=1; i<this.table.rows.length; i++) {
			var row = this.table.rows[i];
			for (var j=1; j<row.cells.length; j++)
			  if (this.applyColumns[j])
				this.addItemToCell( row.cells[j], i, j );
		}
	}
	, addItemToCell : function( cell, row, col ){
		var el = this.createEl( "span", "innerHTML", this.cfg.label, "rcNum", [row,col] );
		cell.appendChild( el );
	}
	, createEl : function( tag, at0, v0, at1, v1 ){
		var el = document.createElement( tag );
		if (at0) el[at0] = v0;
		if (at1) el[at1] = v1;
		el.master = this;
		return el;
	}
	, getEventStamp : function(el){
		var dir = this.row0[el.rcNum[1]];
		return "event for "+dir;
	}
	, replaceUrl : function( rc, v ){
		var rowi = "row"+rc[0];
		for (var i=0,at=this.getCgi(); i<at.length; i++)
			if (at[i].indexOf(rowi+"=")==0){
				var av = unescape(at[i].substring(rowi.length+1)).split("^^");
				if (rc[1]<av.length) av[rc[1]] = v;
				at[i]= rowi +"=" +escape(av.join("^^"));
			}
		res = "?"+at.join("&");
		location = res;
	}
	, event_Item : function(ev,el){
		var res = this.getEventStamp(el)
		this.replaceUrl( el.rcNum, res );
	}
	, mold : function( target, src ){
		var source = (src)? src : this;
		for (var m in source) target[m] = source[m];
	}
}

function QuickCheckbox( cfg ){
	baseAddon.mold( this, baseAddon );
	this.ver = "v0.54"
	this.cfg = cfg;
	this.addItemToCell = function( cell, row, col ){
		var el = this.createEl( "input", "type", "button", "value", this.cfg.label );
		el.rcNum = [row,col];
		el.origHTML = cell.innerHTML;
		el.onclick = function(ev){ this.master.click_Button(ev, this) }
		cell.appendChild( el );
	}
	this.getStamp = function(el){
		var dir = this.row0[el.rcNum[1]];
		if (el.origHTML.replace("&nbsp;","")) return "";
		if (dir.match(/:checkdate/)){
			var d = new Date();
			return d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate();
		} else
			return "X";
	}
	this.click_Button = function(ev,el){
		var res = this.getStamp(el)
		this.table.rows[el.rcNum[0]].cells[el.rcNum[1]].innerHTML= res;
		this.replaceUrl( el.rcNum, res );
	}
}

qcb = new QuickCheckbox( {key:":checkdate", label:"x"} );
qcb.init();
qcb = new QuickCheckbox( {key:":checkbox", label:"x"} );
qcb.init();
qcb.nextAddon();
