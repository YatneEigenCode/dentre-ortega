//11-24-2017 jchoy v0.118 separate tshelper
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
        const el = D.createElement( 'script' );
        el.src = tsh.buildUrl1( num );
        D.body.appendChild(el);
    }
    return {go:appendTag}
}

//-----
tsHelperBox= function(){
    return tsHelper( '/get/{0}', '' , '/ts' );
}

new TsJsCgi( tsHelperBox() ).start();
