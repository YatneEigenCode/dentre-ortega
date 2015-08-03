//8-1-15 JChoy DomSel - Selects DOM element(s) and apply changes.
//8-2-15 JChoy v0.1.115 Fixed _filterByAttributes. Added optional 3rd param to set()
//-----
function DomSel(){
	this.version = "v0.1.115";
	this.set= function( ref, val, specEl ){
		var ar= ref.split(".");
		var at= (specEl)? [specEl] : this._getEls();
		for (var i=0; i<at.length; i++){
			var rr= at[i];
			for (var j=0; j<ar.length-1; rr= rr[ar[j++]]);
			if (rr) rr[ar[ar.length-1]] = val;
		}
	}
	this._getEls= function(){
		var d$= document, ssp= this.selectorSpec;
		var res= d$.body.childNodes;
		if (ssp.tag != "*") res= d$.getElementsByTagName(ssp.tag)
		else if (ssp.classname != "*") res= d$.getElementsByClassName(ssp.classname)
		else if (ssp.name != "*") res= d$.getElementsByName(ssp.name)
		else if (ssp.id != "*") res= [d$.getElementById(ssp.id)];
		if (!res[0]) res=[];
		return this._filterByAttributes(res);
	}
	this._filterByAttributes= function(ad){
		var d$= document, sso= this.selectorSpec.oth, res=[];
		var ax= new Array(ad.length);
		for (var i=0; i<sso.length; i++)
		    for (var j=0; j<ad.length; j++)
			if (ax[j]){
			} else if (ad[j].attributes) {
				var attr= ad[j].attributes[sso[i][0]];
				if (!attr)  ax[j]=1;
				else if (attr.value != sso[i][1]) ax[j]=1;
			} 
		for (var i=0; i<ax.length; i++)
			if (!ax[i]) res.push(ad[i]);
		return res;
	}
	this._storeArgs= function(args){
		this.selectorSpec = {tag:"*", max:-1, id:"*", 
			name:"*", classname:"*", oth:new Array()};
		for (var i=0; i<args.length; i++){
			var at= args[i].split(":");
			if (this.selectorSpec[at[0].toLowerCase()])
				this.selectorSpec[at[0].toLowerCase()]= at[1];
			else this.selectorSpec["oth"].push(at);
		}
	}
	this._storeArgs(arguments);
}
/*
Examples:
new DomSel().set( "style.backgroundColor", "lightgray" );
new DomSel("tag:div","max:1").set( "style.backgroundColor", "lightgreen" );
new DomSel("tag:form","max:1").set( "style.backgroundColor", "pink" );
new DomSel("name:foo").set( "style.color", "red" );
new DomSel("id:goo").set( "style.backgroundColor", "lightblue" );
new DomSel("id:goo").set( "onclick", function(){alert(2)} );
new DomSel("className:tank").set( "style.fontWeight", "bold" );

new DomSel().set( "style.backgroundColor", "lightgray" );
var ds = new DomSel("tag:div");
ds.set( "style.backgroundColor", "yellow" );
ds.set( "onclick", function(){
	this.setAttribute("isdone","done");
	new DomSel().set( "style.backgroundColor", "pink", this );
	new DomSel("tag:form","max:1").set( "style.backgroundColor", "lightgreen" );
	new DomSel("className:tank").set( "style.color", "red" );

	ds = new DomSel("isdone:done");
	ds.set( "onmouseover", function(){
		this.attributes["isdone"].value="done";
		this.style.fontWeight= "bold";
	} );
	ds.set( "onmouseout", function(){
		this.style.fontWeight= "normal";
	} );
} );
*/

