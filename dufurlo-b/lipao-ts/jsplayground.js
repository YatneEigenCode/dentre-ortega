//9-19-17 v0.262 txtrailSim; don't reverse array

funArray= function(o,n){var r=[]; while(n-->0)r.push(o); return r}
timeoutPop= function(a,ms,x){ if(x=a.pop())x();else return;
  setTimeout(function(){timeoutPop(a,ms)},ms);
}

insAft=function(nu,old,b){ b.insertBefore(nu,old); b.insertBefore(old,nu); }
insertAfter=function(nu,old){ try{insAft(nu,old,document.body)}catch(E){}; insAft(nu,old,old.parentNode) }
popTbl= function(tbl,old){
   tbl.style.border= "1 solid black";
   insertAfter( tbl, old );
   tbl.onclick= function(){ this.parentNode.removeChild(this); }
   return tbl;
}
txtrail=function(el,s){
  if (el===undefined) return exportNamespace();
  var f1=function(amr, observer){ amr.forEach( function(){ 
    el.txtrailHist.unshift([new Date(),el.innerHTML]); el.txtrailHist.splice(10)} ) }
  el.txtrailHist=[]; el.innerHTML=s;
  el.onclick= function(){
    if (!this.txtrailHist) return alert("missing");
    var tbl= popTbl(document.createElement("table"),this);
    this.txtrailHist.forEach( function(ap,i){ var r=tbl.insertRow(i);
      [ap[1],ap[0].toLocaleString()].forEach(function(v){r.insertCell(0).innerHTML=v}); } );
  }
  new MutationObserver(f1).observe( el, {characterData:true, subtree:true} );
  return el;
}
txtrailSim=function(s){
  for (var i=0,at=document.getElementsByTagName("div"); i<at.length; i++){if(at[i].txtrailHist)at[i].innerHTML=s}
}
//var el=txtrail(new AppTool().addEl("div"), "loading...");
//timeoutPop( funArray(function(){  el.innerHTML=" num ["+Math.random()+"] "+el.txtrailHist.length}, 4), 2000 );

exportNs= function(o){ for (var m in o) o[m]= eval(m); return o; }
exportNamespace= function(){ return exportNs(
  {txtrail:0, insertAfter:0, funArray:0, timeoutPop:0, txtrailSim:0} 
) }
//var nsTxtrail= txtrail();
//var x= nsTxtrail.funArray({},9);
