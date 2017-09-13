//9-13-17 v0.212 txtrail; fix else typo;

funArray= function(o,n){var r=[]; while(n-->0)r.push(o); return r}
timeoutPop= function(a,ms,x){ if(x=a.pop())x();else return;
  setTimeout(function(){timeoutPop(a,ms)},ms);
}
var fn=function(){alert(3)};

txtrail=function(el,s){
  var f2=function(mr,t){ el.txtrailHist.push(el.innerHTML) }
  var f1=function(amr, observer){ amr.forEach(f2); }
  el.txtrailHist=[]; el.innerHTML=s;
  el.onclick= function(){alert(this.txtrailHist.length)}
  new MutationObserver(f1).observe( el, {characterData:true, subtree:true} );
  return el;
}
//var el=txtrail(new AppTool().addEl("div"), "ola ");
//timeoutPop( funArray(function(){el.innerHTML+=" *"},11), 2000 );
