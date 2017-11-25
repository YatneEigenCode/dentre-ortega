//11-24-2017 jchoy v0.115 call cgi with correct parameters
//-----
function TsJsCgi(theTsHelper){
    this.tsh= theTsHelper;
    this.cgi= function(k,def,qy){
        var at=(qy+"").split(new RegExp("[\&\?]"+k+"="));
        return (at.length==1)?def:at[1].split("&")[0];
    }
    this.start= function(){
        const at = this.cgi('js','',location).split(',');
        at.map( scriptHelper(this.tsh).go );
    }
}

//-----
scriptHelper = function(tsh){
    const D  = document;
    appendTag = function(num){
        const el = D.createElment( 'script' );
        el.src = tsh.buildUrl1( num );
        D.appendChild(el);
    }
    return {go:appendTag}
}

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
              url = url.replace('{'+i+'}',params[i])
          return url;
    }
    return {save:save, get:get, cb:cb,
        buildUrl1: buildUrl1, buildUrl2: buildUrl2 };
}
tsHelperBox= function(){
    return tsHelper( '/get/{0}', '' , '/ts' );
}

new TsJsCgi( tsHelperBox() ).start();
