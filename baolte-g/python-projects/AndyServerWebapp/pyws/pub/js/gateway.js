//11-26-2017 jchoy v0.146 gwUrl
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
  return gwClient(gateway, fn);
}
//-----
gwClient= function(gateway, fn){
  const gwUrl= gateway.parentNode.src;
  function handleResponse(ev){
      try {
        if ( gwUrl.indexOf(ev.origin) != 0 )
          console.log("origin mismatch",ev.origin);
      } catch (e) {}
      if (ev.source != gateway )
          console.log("source mismatch");
      const gr = JSON.parse( ev.data );
      console.log( gr );
      if (fn) fn( gr.data );
  }
  window.addEventListener('message',handleResponse);
  function get(nm){
      const gc = {cat:'get', num:nm}
      gateway.postMessage
        (JSON.stringify(gc),'*');
  }
  return {get:get}
}
//client usage: gatewayClient(url).get('101')
