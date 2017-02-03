//2-2-2017 v0.119 EgRowB/onmouseout; shorten; selection, toggle
CmdMod05= function(cap){
  this.doCmd=function(at){
    if (at[0]=="egrow") return [new EgRowB().init(cap), "ok"][1];
  }
}
tmpfs.write( "cmdmods.txt", "CmdMod05" );
tmpfs.log( "log", "m4:egrow" );
EgRow= function(){
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
  this.fillUxCell= function(cel){ cel.innerHTML="od " }
}
EgRowA= function(){
  new SnAppFdn().inherit( this, SnAppFdn );
  new SnAppFdn().inherit( this, EgRow );
  this.verbs= "esc".split(",");
  this.cfgBgColor= "orange";
  this.fillUxCell= function(cel){
    cel.table= this;
    cel.style.backgroundColor= this.cfgBgColor;
    for (var i=0; i<this.verbs.length; i++) this.mkVerb(this.verbs[i], cel);
  }
  this.verbClick= function(){
    tmpfs.log("log",this.parentNode.parentNode.rowIndex+"/"+ 
      this.parentNode.table.rows.length);
  }
  this.mkVerb= function( v, cel ){
      this.addEl( "span", cel ).innerHTML= v;
      this._.style.padding= "0 10 0 10";
      var $cbc= this.cfgBgColor;
      this._.onmouseover=function(){this.style.backgroundColor="lightgray"}
      this._.onmouseout= function(){this.style.backgroundColor=$cbc}
      this._.onclick= this.verbClick;
  }
}
EgRowB= function(){
  new SnAppFdn().inherit( this, EgRowA );
  this.verbs= "hi-light,remove,re-run,shorten,scroll,graph,min-max,cmd,help,add-note,recent*,...,[-]".split(",");
  this.verbClick= function(){
    var cel= this.parentNode, t=this.onmouseout();
    var ii= cel.parentNode.rowIndex
    cel.table.deleteRow(ii);      
    if (this.innerHTML=="remove") cel.table.deleteRow(ii-1);
    if (this.innerHTML=="hi-light")
      cel.table.toggle( cel.table.rows[ii-1].style,"backgroundColor","yellow","transparent" );
    if (this.innerHTML=="shorten"){
      var el=cel.table.rows[ii-1].cells[0];
      el.innerHTML= cel.table.midcate(el.innerHTML,10);
    }
    if (this.innerHTML=="re-run"){
      var c=cel.table,s= cel.table.rows[ii-1].cells[0].innerHTML;
      c.igniteDiv( c.writeRow(s,c.doCmd(s)) );

    }
  }
  this.toggle= function( ob, nm, v1, v2 ){ ob[nm]= (ob[nm]==v1)? v2:v1; }
}
//new EgRowB().init( document.getElementsByTagName("table")[0] );
tmpfs.write( "runonce.txt", "egrow");