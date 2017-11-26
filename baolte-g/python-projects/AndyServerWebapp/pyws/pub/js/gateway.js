//11-25-2017 jchoy v0.141 gatewayClient
function gateway (tshelper){
    respond=function (resTxt){
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
              const url=
               tshelper.buildUrl1(gc.num)
              if (gc.cat=='get')
                  tshelper.getRel
                    (url,respond);
          } 
        )
    }
    return {start: start}
}
//communicator usage: gateway().start()

//-----
gatewayClient= function(url){
  const D=document;
  const gateway= (function(){
      const el= D.createElement('iframe');
      el.src= url;
      return D.body.appendChild( el );
  })().contentWindow;
  function handleResponse(ev){
      if (ev.origin != url )
          console.log("origin mismatch",ev.origin);
      if (ev.source != gateway )
          console.log("source mismatch",ev.source);
      const gr = JSON.parse( ev.data );
      console.log( gr );
  }
  window.addEventListener('message',handleResponse);
  function get(theNum){
      const gc = {cat:'get', num:theNum}
      gateway.postMessage
        (JSON.stringify(gc),'*');
      setTimeout( function(){get(theNum)}, 20000 );
  }
  return {get:get}
}
//client usage: gatewayClient(url).get('101')
