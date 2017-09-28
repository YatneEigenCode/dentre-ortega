baseAddon.SmartScript = function(tagsrc, chain){
	this.tagsrc = tagsrc;
	baseAddon.mold( this );
	if (tagsrc){
		this.chain = new baseAddon.SmartScript();
	} else {	//prep chain
		var info = this.getAttr( "src", "none", this.thisTag() );
		var next = parseInt(info.replace( /.*(\d)\.js/, "$1"))+1;
		this.tagsrc = info.replace( /(.*)\d(\.js)/, "$1"+next+"$2");
		if (this.tagsrc == info) this.tagsrc="";
	}
	this.tag = document.createElement( "script" );
	this.start = function(){
		if (!this.tagsrc) return;
		this.tag.src = this.tagsrc;
		document.body.appendChild( this.tag );
		if (this.chain) this.chain.start();
	}
}

z={};	//need this due to browser bug.
//subsequent chains only need the following line:
(new baseAddon.SmartScript( "addon/cqtabul.test6.js" )).start();
