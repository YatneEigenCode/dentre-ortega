//9-14-17 v0.245 insAft for try-catch
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
  var f1=function(amr, observer){ amr.forEach( function(){ 
    el.txtrailHist.unshift([new Date(),el.innerHTML]); el.txtrailHist.splice(10)} ) }
  el.txtrailHist=[]; el.innerHTML=s;
  el.onclick= function(){
    if (!this.txtrailHist) return alert("missing");
    var tbl= popTbl(document.createElement("table"),this);
    this.txtrailHist.reverse().forEach( function(ap){ var r=tbl.insertRow(0);
      r.insertCell(0).innerHTML=ap[0].toLocaleString(); r.insertCell(1).innerHTML=ap[1]; } );
  }
  new MutationObserver(f1).observe( el, {characterData:true, subtree:true} );
  return el;
}
//var el=txtrail(new AppTool().addEl("div"), "loading...");
//timeoutPop( funArray(function(){  el.innerHTML=" num ["+Math.random()+"] "+el.txtrailHist.length}, 4), 2000 );
