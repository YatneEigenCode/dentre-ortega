//1-25-08  v1.31 JChoy clear isBusy before writing; fix typo in shipIt;
//3-9-08   v1.32 JChoy simpler version, default isRss=false;

DxpSimple = function(writer){	//json cross domain transport
  this.writer = new ScrapeWriter( null, null, false, writer );
  this.progId = "";
  this.setId= function(){var nm="";for (var i=0; (window[nm="o"+i]); i++){} window[nm]=this; return nm; }
  this.rec = function(ao){
	this.result  =this.transform( ao, this.feedObj );
	if (this.writer) this.writer.write(this.result);
	this.feedObj = null;
  }
  this.phpUrl = "http://rip/scrape2json.php";
  this.webGet = this.request = function( url ){
	if ((!url) || (this.feedObj)) return;	//no queuing
	if (!this.progId) this.progId = this.setId();
	this.feedObj = { feed:url, template:"{0}", specs:["data!subxf"], subxf:{template:"{0}", specs:["{$}"], loop: [0,null,1]} };
	var x=document.createElement('script');
	var phpUrl = this.phpUrl + "?rand="+Math.random();
	x.src= phpUrl +"&callback=" + this.progId +".rec&feed="+escape(this.feedObj.feed)
	document.body.appendChild(x);
  }

  this.transformLoop = function( jo, jt ) {
		var res = "";
		var lim= (jt.loop[1]==null)? jo.length : jt.loop[1];
		for (var i=jt.loop[0]; i<lim; i+=jt.loop[2]){
			var spec_i = new Array();
			for (var j=0; j<jt.specs.length; j++) 
				spec_i[j] = jt.specs[j].replace('{$}',i);
			res+= this.transform( jo, {template:jt.template, specs:spec_i} );
		}
		return res;
  }
  this.transform = function( jo, jt ) {
	var av = new Array();
	if (jt.loop) return this.transformLoop( jo, jt );
	for (var j=0; j<jt.specs.length; j++)
		av[av.length]= this.getNode(jo, jt.specs[j], jt)
	var res = jt.template +"";
	for (var i=0; i<av.length; i++)
		res = res.split("{"+i+"}").join(av[i]);
	return res;
  }
  this.getNode = function( json, spec, jt ){
	var node= json;
	var ap= spec.split("!");
	for (var i=0,at=(ap[0]+"").split("/"); i<at.length; i++)
		node = node[at[i]]
	if (ap.length>1) return this.transform( node, jt[ap[1]] );
	return node;
  }
}

function ScrapeWriter( startKey, endKey, isStripWhite, writer ){	//pipe
	this.startKey = startKey;
	this.endKey = endKey;
	this.isStripWhite = isStripWhite;
	this.writer = (writer)? writer : {write:function(){}};
	this.write = function(msg){
		msg = this.stripHtml( this.hex2bin( msg ) );
		if (this.isStripWhite) msg = this.stripWhite(msg)
		var msg2 = (startKey==null)? msg : (msg+this.startKey).split(this.startKey)[1];
		this.writer.write( msg2.split(this.endKey)[0] );
	}
	this.hex2bin = function( s ){
		var res="";
		for (var i=0; i<s.length; i+=2)
			res+= unescape("%"+s.substr(i,2))
		return res;
	}
	this.stripHtml = function(s){
		var res=""
		for (var i=0,at=s.split(">"); i<at.length; i++)
			res+= at[i].split("<")[0]
		return res.replace(/\&nbsp;/g," ");
	}
	this.stripWhite = function(msg){
		return msg.replace(/\t/g,"").split("\n").join(" ").split("\r").join(" ").replace(/    /g,"");
	}
}
