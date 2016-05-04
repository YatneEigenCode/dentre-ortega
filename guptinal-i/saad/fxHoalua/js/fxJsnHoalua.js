//5-4-2016 JChoy Hoalua framework package
//-----
fxJsnHoalua= {
	expandStrings: function( jo, res ){
		var prm={}, res= res? res : {};
		for (var m in jo)
		  if (typeof(jo[m])==="string") prm[m]= "_"+m+"_";
		for (var m in prm) for (var n in prm)
			res[m]= jo[m].replace(prm[n],jo[n]);
		return res;
	}
	,enumArray: function(at){
		var res={i:0, max:at.length, at:at}
		res.getNext= function(){ return this._= ((this.hasNext())? this.at[this.i++]:null) };
		return [res, res.hasNext=function(){return this.i < this.max}][0];
	}
	,class_JSR: function(jo){
	  fxJsnHoalua.expandStrings( jo, this );
	}
	,class_MyApp: function(){
	  (function(t,c,a){t.c=c;t.c(a)})(this,DivApp);
	  var $t= this;
	  this.start= function(cfg){
		this.cfg= new JSR(cfg);
		this.addEl("div").innerHTML= this.cfg.b;
		new Sob(PubSub).i0.subscribe(this, function(s,c){$t.gu(s,c)});
		this._.onclick= function(){ new Sob(PubSub).i0.publish(this.innerHTML.length); }
	  }
	  this.gu= function(s,c){
		this.addEl("div").innerHTML= "gu: "+s;
		new Sob(PubSub).i0.subscribe(this); //unsubscribe
	  }
	}
	,class_DivApp: function(jo){
	  var $d= document;
	  this.addEl= function(tag, par){
		return this._ = (par? par : $d.body).appendChild( $d.createElement(tag) );
	  }
	}
	,class_Sob: function(cls){ this.i0= fxJsnHoalua.getSingleton(cls); }
	,getSingleton: function(cls){
		if (!window["listOfSingletons"]) listOfSingletons = [];
		for (var ea=this.enumArray(listOfSingletons); ea.hasNext();)
		  if ((ea.getNext()) instanceof cls) return ea._;
		return [this._=new (cls)(), listOfSingletons.push(this._)][0];
	}
	,class_PubSub: function(){
	  this.subscribers = new Array();
	  this.publish= function(s, channel){
		for (var i=0, at=this.subscribers; i<at.length; i++)
			if (at[i][1]) at[i][1](s, channel );
	  }
	  this.subscribe= function( client, fcn ){
		if (fcn) return this.subscribers.push( [client, fcn] );
		for (var i=0, x=this._=[], at=this.subscribers; i<at.length; i++)
			if (at[i][0]!=client) x.push(at[i]);
		this.subscribers= this._;
	  }
	}
	,setupClass: function(nm){ window[nm]= this["class_"+nm]; }
	,setupClasses: function(){
	  for (var m in this) if (m.indexOf("class_")==0) this.setupClass(m.substr(6));
	}
}
