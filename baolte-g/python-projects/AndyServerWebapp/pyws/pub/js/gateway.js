//11-25-2017 jchoy v0.137 buildUrl1
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

//gateway().start()
