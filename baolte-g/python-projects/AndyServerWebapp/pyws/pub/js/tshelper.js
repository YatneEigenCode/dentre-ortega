//11-26-2017 jchoy v0.174 encodeURIComponent

//-----
tsHelper = function(verb1, verb2, urlBase, cb){
    save= function(i,data){
        const im = new Image();
        im.src= buildUrl2( i, data );
    }
    buildUrl1= function(i){ return buildUrl(verb1, [i]) }
    buildUrl2= function(i,d){ return buildUrl(verb2, [i,d]) }
       
    function get(i){
        const url= buildUrl1( i );
        if (url.indexOf('/') == 0)
              getRel( url, this.cb )
        else
              loadUrlToIframe( url );
    }
    getRel = function( url, fn ){  //xhr
           const xhr= new XMLHttpRequest();
           xhr.open( "GET", url, false );
           xhr.onload= function(evt){ fn(xhr.responseText) }
           xhr.send(null);
    }
    buildUrl= function( verb, params ){
          var url= urlBase+verb;
          for (var i=0; i<params.length; i++)
              url = url.replace('{'+i+'}', 
                encodeURIComponent(params[i]) );
          console.log("bu", url);
          return url;
    }
    return {save:save, get:get, cb:cb,
        buildUrl1: buildUrl1,
        buildUrl2: buildUrl2 };
}

loadUrlToIframe = function(url){
    var div= document.getElementById('result');
    div.innerHTML= '';
    var ifr= document.createElement('iframe');
    div.appendChild(ifr). src= url;
}
