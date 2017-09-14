//9-13-17 v0.231 showHist, insertAfter, popTbl;
funArray= function(o,n){var r=[]; while(n-->0)r.push(o); return r}
timeoutPop= function(a,ms,x){ if(x=a.pop())x();else return;
  setTimeout(function(){timeoutPop(a,ms)},ms);
}

insertAfter=function(nu,old){ var b=document.body; b.insertBefore(nu,old); b.insertBefore(old,nu); }
popTbl= function(tbl,old){
   tbl.style.border= "1 solid black";
   insertAfter( tbl, old );
   tbl.onclick= function(){ this.parentNode.removeChild(this); }
   return tbl;
}
showHist=function(){
   if (!this.txtrailHist) return alert("missing");
   var tbl= popTbl(document.createElement("table"),this);
   this.txtrailHist.forEach( function(s){tbl.insertRow(0).insertCell(0).innerHTML=s} );
}
txtrail=function(el,s){
  var f1=function(amr, observer){ amr.forEach(function(){el.txtrailHist.push(el.innerHTML)}) }
  el.txtrailHist=[];
  el.onclick= showHist;
  new MutationObserver(f1).observe( el, {characterData:true, subtree:true} );
  return el;
}
//var el=txtrail(new AppTool().addEl("div"), "ola ");
//timeoutPop( funArray(function(){//  el.innerHTML=" num ["+Math.random()+"] "+el.txtrailHist.length}, 11), 2000 );
