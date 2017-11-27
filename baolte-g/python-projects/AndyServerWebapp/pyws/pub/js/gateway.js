//11-26-2017 jchoy v0.261 count
//Widget for cross domain data read 
//using iframe and postMessage.
//Requires tshelper

//-----
function gateway (tshelper){
    tshelper.cb= function (resTxt){
        const gr={
          cat:'response',
          data:resTxt
        }
        parent.postMessage
          (JSON.stringify(gr), '*')
    }
    start=function (){
        window.addEventListener(
          'message',
          function(ev){
              console.log('gw event');
              const gc= JSON.parse
                (ev.data);
              if (gc.cat=='get')
                  tshelper.get(gc.num);
          } 
        )
    }
    return {start: start}
}
//communicator usage: gateway().start()

//-----
gatewayClient= function(url, fn){
  const D=document;
  const gateway= (function(){
      const el= D.createElement('iframe');
      el.src= url;
      return D.body.appendChild( el );
  })().contentWindow;
  return gwClientUrl(gateway, url, fn);
}
//-----
gwClient= function(gateway, fn){
  return gwClientUrl(gateway, '*', fn );
}
//-----
gwClientUrl= function(gateway, url, fn){
  var isBusy = false;
  const count= {originMismatches:0,
      requestsSent:0, messagesReceived:0}
  function handleResponse(ev){
      count.messagesReceived++;
      if ( (""+url).indexOf(ev.origin) != 0 )
          return count.originMismatches++;
      if (ev.source == gateway ){
        const gr = JSON.parse( ev.data );
        if (gr.cat == 'response'){
          isBusy = false;
          if (fn) fn( gr.data );
        }
      }
  }
  window.addEventListener
    ('message',handleResponse);
  function get(nm){
      const gc = {cat:'get', num:nm}
      isBusy = true;
      count.requestsSent++;
      gateway.postMessage
        (JSON.stringify(gc),'*');
  }
  return {get:get}
}
//client usage: gatewayClient(url).get('101')
