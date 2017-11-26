//11-25-2017 jchoy v0.125 gateway
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
              const gc= JSON.parse
                (ev.data);
              if (gc.cat=='get')
                  tshelper.getRel
                    (gc.num,respond);

          } 
        )
    }
    return {start: start}
}

//gateway().start()
