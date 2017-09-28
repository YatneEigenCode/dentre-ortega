nextAddon = {
	getAttr: function(nm, def, obj){return (obj && obj.attributes && obj.attributes[nm])? obj.attributes[nm].value : def;}
	, thisTag: function(){
		var at= document.getElementsByTagName("script");
		return at[at.length-1];
	}
	, prep : function(){
		var info = this.getAttr( "src", "none", this.thisTag() );
		var next = parseInt(info.replace( /.*(\d)\.js/, "$1"))+1;
		this.tagsrc = info.replace( /(.*)\d(\.js)/, "$1"+next+"$2");
		if (this.tagsrc == info) this.tagsrc="";
	}
	, nextAddon : function(){
		var tag = document.createElement( "script" );
		if (this.tagsrc != ""){
			tag.src= this.tagsrc;
			document.body.appendChild( tag );
		}
	}
};
nextAddon.prep();

({
	src : "addon/cqtabul.urlfile.js"			//change this for your own use
	, tag : document.createElement( "script" )
	, start : function(){
		this.tag.src = this.src;
		document.body.appendChild( this.tag );
	}
}).start();

nextAddon.nextAddon();
