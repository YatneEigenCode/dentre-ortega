//9-12-17 v0.112 funArray and timeoutPop

funArray= function(o,n){var r=[]; while(n-->0)r.push(o); return r}
timeoutPop= function(a,ms,x){ if(x=a.pop())x()else return;
  setTimeout(function(){timeoutPop(a,ms)},ms);
}
var fn=function(){alert(3)};
timeoutPop( funArray( fn, 3 ), 2000 );
