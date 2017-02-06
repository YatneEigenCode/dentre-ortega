//2–5-2017 v0.131 egrowF
CmdMod05= function(cap){
  this.doCmd=function(at){
    if (at[0]=="egrow") return [new EgRowF().init(cap), "ok"][1];
  }
}
//tmpfs.write( "cmdmods.txt", "CmdMod05" );
//tmpfs.log( "log", "m11:egrow-d" );
EgRowA= function(){
  this.egrow_ver= "0.131";
  this.row0= 1;
  this.init= function(tbl){
    for (var m in this) tbl[m]=this[m];
    tbl.itableData= {};
  }
  this.onclick= function(ev){
    if (!window.getSelection().isCollapsed) return;
    for (var i=this.row0; i<this.rows.length; i++)
      if (this.rows[i].contains(ev.target)) this.uxRow(i);
  }
  this.uxRow= function(i, tt){
    if (!(tt=this.itableData).uxRow) 
      this.fillUxCell( (tt.uxRow=this.insertRow(0)).insertCell(0) );
    if (tt.uxRow==this.rows[i]) return;
    tt.uxRow.cells[0].colSpan= this.rows[i].cells.length+1;
    this.insBef(this.rows[i], this.insBef(tt.uxRow,this.rows[i]));
  }
  this.insBef= function(n,o){return o.parentNode.insertBefore(n,o)}
  this.fillUxCell= function(cel){ cel.innerHTML=". . ." }
}
EgRowB= function(){
  new SnAppFdn().inherit( this, SnAppFdn );
  new SnAppFdn().inherit( this, EgRowA );
  this.verbs= "esc".split(",");
  this.cfgBgColor= "orange";
  this.fillUxCell= function(cel){
    cel.table= this;
    cel.style.backgroundColor= this.cfgBgColor;
    for (var i=0; i<this.verbs.length; i++) this.mkVerb(this.verbs[i], cel);
    this.isMore= false;
  }
  this.verbClick= function(){ tmpfs.log("log",this.innerHTML); }
  this.mkVerb= function( v, cel ){
      this.addEl( "span", cel ).innerHTML= v;
      this._.style.padding= "0 10 0 10";
      this._.onmouseover=function(){this.style.backgroundColor="lightgray"}
      this._.onmouseout= function(){this.style.backgroundColor="transparent"}
      this._.onclick= this.verbClick;
      if (this.isMore) this._.style.display="none";
      if (this.isMore) this._.isExtra= true;
      if (v=="...") this.isMore= true;
  }
}
EgRowC= function(){
  new SnAppFdn().inherit( this, EgRowB );
  this.lastVerbClickNum=0;
  this.verbClick= function(){
    var cel= this.parentNode, t=this.onmouseout();
    var ii= cel.parentNode.rowIndex
    var cn= this.parentNode.childNodes;
    if (this.innerHTML == "...") {
      for (var i=0; i<cn.length; i++)
        if (cn[i].isExtra) cel.table.toggle( cn[i].style,
          "display", "none", "inline" );
      return;
    } else  cel.table.deleteRow(ii);
    for (var i=1; i<=cel.table.lastVerbClickNum; i++)
      cel.table["verbClick"+i](this.innerHTML,ii,cel);
    for (var i=0; i<cn.length; i++)
      if (cn[i].isExtra) cn[i].style.display="none";
  }
  this.toggle= function( ob, nm, v1, v2 ){ ob[nm]= (ob[nm]==v1)? v2:v1; }
}
EgRowD= function(){
  new SnAppFdn().inherit( this, EgRowC );
  this.verbs= "hi-light,min,remove,add-note,note-add,...".split(",");
  this.lastVerbClickNum=1;
  this.verbClick1= function(verb,ii,cel){
    if (verb=="remove") cel.table.deleteRow(ii-1);
    if (verb=="hi-light")
      cel.table.toggle( cel.table.rows[ii-1].style,
        "backgroundColor","yellow","transparent" );
  }
}
EgRowE= function(){
  new SnAppFdn().inherit( this, EgRowD );
  this.lastVerbClickNum=2;
  this.verbClick2= function(verb,ii,cel){
    var app= cel.table;
    if (verb=="note-add")
      app.rows[ii-1].insertCell(0).innerHTML= 
        prompt("Message:");
    if (verb=="add-note")
      app.rows[ii-1].insertCell().innerHTML= 
        prompt("Message:");
    if (verb=="min")
      for (var i=0,at=app.rows[ii-1].cells; i<at.length; i++)
        new Minzer().init( at[i] );
  }
}
EgRow= function(){
  new SnAppFdn().inherit( this, EgRowE );
  this.addVerbs=function(s){
    for (var i=0,at=s.split(","); i<at.length; i++)
      this.verbs.push(at[i]);
  }
  this.addVerbs("eggrow?");
  this.lastVerbClickNum=3;
  this.verbClick3= function(verb,ii,cel){
    if (verb=="eggrow?") 
      cel.table.rows[ii-1].insertCell().innerHTML= this.egrow_ver;
  }
}
EgRowF= function(){
  new SnAppFdn().inherit( this, EgRow );
  this.addVerbs("re-run,shorten,graph,scroll,cmd");
  this.lastVerbClickNum=4;
  this.verbClick4= function(verb,ii,cel){
    var app= cel.table;
    if (verb=="shorten"){
      var el=app.rows[ii-1].cells[0];
      el.innerHTML= cel.table.midcate(el.innerHTML,10);
    }
    if (verb=="re-run"){
      var s= app.rows[ii-1].cells[0].innerHTML;
      app.igniteDiv( app.writeRow(s,app.doCmd(s)) );
    }
  }
}
Minzer= function(){
  new SnAppFdn().inherit( this, SnAppFdn );
  this.init=function( el ){
    this.addEl("div").onclick= this.restore;
    this._.innerHTML= "[+]".fontcolor("green");
    this._.asset= el.innerHTML;
    el.innerHTML="";
    el.appendChild(this._);
  }
  this.restore= function(ev){
    this.innerHTML= this.asset;
    ev.stopPropagation();
    this.onclick=null;
  }
}
//new EgRow().init( document.getElementsByTagName("table")[0] );
//tmpfs.write( "runonce.txt", "egrow");
