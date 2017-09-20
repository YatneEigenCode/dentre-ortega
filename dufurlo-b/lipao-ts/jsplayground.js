//9-20-17 v0.279 exportCode; html; randtxt;

var group_addEl= {};
var D=document;
addEl= function( tag, par ){
	if (tag===undefined) return group_addEl;
	if (!par) par= document.body;
	return this._=par.appendChild( document.createElement(tag) );
}
exportCode= function(o){ return Object.keys(o).reduce( function(r,c){r[c]=eval(c); return r}, {} ) }
insAft= function(nu,old,b){ b.insertBefore(nu,old); b.insertBefore(old,nu); }
insertAfter= function(nu,old){ try{insAft(nu,old,D.body)}catch(E){}; insAft(nu,old,old.parentNode) }
html= function(el,v){ if (v)el.innerHTML=v; return el.innerHTML }
randtxt= function(n,s){
  if ((s=(s)?s:"").length>=n) return s.substr(0,n);
  return randtxt( (n)?n:3, btoa(Math.random().toString().substr(2)).substr(5,15)+s );
}
group_addEl = exportCode( { addEl:0, exportCode:0, insertAfter:0, html:0,randtxt:0 } );
///

var group_popTbl= {};
insertAfter= addEl().insertAfter;
funArray= function(o,n){var r=[]; while(n-->0)r.push(o); return r}
timeoutPop= function(a,ms,x){ if(x=a.pop())x();else return;
  setTimeout(function(){timeoutPop(a,ms)},ms);
}
popTbl= function(tbl,old){
   if (tbl===undefined) return group_popTbl;
   tbl.style.border= "1 solid black";
   insertAfter( tbl, old );
   tbl.onclick= function(){ this.parentNode.removeChild(this); }
   return tbl;
}
group_popTbl = addEl().exportCode( {
   funArray:0
  ,timeoutPop:0
  ,popTbl:0
} );
///

var group_txtrail = {}
html= addEl().html;
txtrail=function(el,s){
  if (el===undefined) return group_txtrail;
  var f1=function(amr, observer){ amr.forEach( function(){ 
    el.txtrailHist.unshift([new Date(),html(el)]); el.txtrailHist.splice(10)} ) }
  el.txtrailHist=[]; html(el,s);
  el.onclick= function(){
    if (!this.txtrailHist) return alert("missing");
    var tbl= popTbl(document.createElement("table"),this);
    this.txtrailHist.forEach( function(ap,i){ var r=tbl.insertRow(i);
      [ap[1],ap[0].toLocaleString()].forEach(function(v){html(r.insertCell(0),v)}); } );
  }
  new MutationObserver(f1).observe( el, {characterData:true, subtree:true} );
  return el;
}
txtrailSim=function(s){
  for (var i=0,th,at=document.getElementsByTagName("div"); i<at.length; i++){
    if(th=at[i].txtrailHist)at[i].innerHTML+="*"+th.length+s}
}
group_txtrail = addEl().exportCode( {
   txtrail:0
  ,txtrailSim:0
} );
///

//txtrail= txtrail().txtrail;
//ns= popTbl();
//timeoutPop= ns.timeoutPop;
//funArray= ns.funArray;
//var el=txtrail(addEl("div"), "loading...");
//timeoutPop( funArray(function(){  el.innerHTML=" num ["+Math.random()+"] "+el.txtrailHist.length}, 4), 2000 );

//var nsTxtrail= txtrail();
//var x= nsTxtrail.funArray({},9);
