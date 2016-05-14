//9-7-06 JKC v0.62 try-catch; ajax; use acceptable bgColor for IE
String.prototype.fillObj= function(){
	var res= window;
	for (var i=0,at=this.split("."); i<at.length; res=res[at[i++]])
		if (!res[at[i]]) res[at[i]]={}
	return res;
}
String.prototype.invoke= function(obj){if (obj[this]) obj[this]()}
String.prototype.getElementByTagLast= function(){var a=document.getElementsByTagName(this); return(a.length)?a[0]:null;}
"ok88.element".fillObj();

ok88.element.base= {
	getAttr: function(nm, def, obj){return (obj && obj.attributes && obj.attributes[nm])? obj.attributes[nm].value : def;}
	, format: function(tpl, ad){res=tpl;for (var i=0; i<ad.length; i++)res=res.split("{"+i+"}").join(ad[i]); return res;}
	, mold: function(dest, src){for (var m in src)dest[m]=src[m]; return dest;}
	, morph: function(el){
		if (this.getAttr("inherits","",el)) {
			this.mold(el, this.getAttr("inherits","",el).fillObj());
			"onmorph".invoke(el);
		}
		for (var i=0; i<el.childNodes.length; i++) this.morph(el.childNodes[i]);
	}
	, cgi: function(k,def,qy){ var at=(qy+"").split(new RegExp("[\&\?]"+k+"=")); return (at.length==1)?def:at[1].split("&")[0]; }
	, setId: function(){var nm="";for (var i=0; (window[nm="o"+i]); i++){} window[nm]=this; return nm; }
	, anfuge: function(nm){return new Function("e",this.setId()+"."+nm+"(e)");}
	, write: function(s,a){this.innerHTML=(!a)?s:(this.innerHTML+s);}
}
ok88.element.ajax= {
	newHttpRequest: function(){
		if (window.ActiveXObject)
			return new ActiveXObject( "Msxml2.XMLHTTP" )
		else 
			return new XMLHttpRequest();
	}
	, onmorph: function(){ this.webGet(); }
	, webGet: function( url, handler ){
		var scraper = this.scraper = this.newHttpRequest();
		var url= (url)? url:this.getAttr("src","",this);
		if ((!scraper) || (!url)) return;
		try {
		 scraper.open( "GET", url, true );
		 scraper.onreadystatechange= this.anfuge( (handler)?handler:"handleHttp" );
		 scraper.setRequestHeader( "If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT" );
		 scraper.send(true);
		} catch (e) { this.write( e ); }
	}
	, handleHttp: function(){

		if (this.scraper.readyState == 4) {
			if ((this.scraper.status == 200) || (this.scraper.status == 0)){ //0:file:
				this.write( this.scraper.responseText );
			} else 
				this.write( this.scraper.status + " - " + this.scraper.statusText );
		}
	}
}
ok88.element.base.mold(ok88.element.ajax, ok88.element.base);

ok88.element.collapsibleDiv={
	version: "0.62"
	, isCollapsed: false
	, toggleDisplay: function(){
		if (!this.collapsedStyle) this.collapsedStyle= {overflow:"hidden", height:20};
		if (!this.expandedStyle) this.expandedStyle= {overflow:"auto", height:this.style.height};
		this.mold(this.style, (this.isCollapsed= !this.isCollapsed)?this.collapsedStyle:this.expandedStyle);
	}
	, clear: function(){ for(; this.childNodes.length>1; this.removeChild(this.childNodes[1])); }
	, createCaption: function(){
		this.appendChild( this.captionDiv= document.createElement("div") );
		this.captionDiv.style.backgroundColor= "#CBCBCB";
		this.captionDiv.className= this.getAttr("captionClass","caption",this);
		this.captionDiv.onclick= this.anfuge("toggleDisplay");
		this.insertBefore( this.captionDiv, this.childNodes[0] );
		this.captionDiv.innerHTML= this.getAttr("caption","collapsibleDiv",this);
	}
}
ok88.element.base.mold(ok88.element.collapsibleDiv,ok88.element.ajax);
ok88.element.collapsibleDiv.onmorph= function(){
		this.createCaption();
		this.isCollapsed= !this.getAttr("initialCollapsed","",this);
		this.toggleDisplay();
		this.webGet();
}
ok88.element.collapsibleDiv.write= function(s,a){ 
	var colSep = unescape(this.getAttr("colSep",",",this));
	var rowSep = unescape(this.getAttr("rowSep","%0a",this));
	for (var i=0,at=s.split(rowSep),k=this.clear(); i<at.length; i++)
		this.writeFormatted( at[i].split(colSep), 1 ); 
}
ok88.element.collapsibleDiv.writeFormatted= function(ad,ap){
		if (!ap) this.clear(); 
		this.appendChild( this.tmp=document.createElement("div") ).innerHTML= this.format(this.getAttr("template","{0}",this),ad);
		this.morph(this.tmp);
}

eval(ok88.element.base.getAttr("start","","script".getElementByTagLast()));
