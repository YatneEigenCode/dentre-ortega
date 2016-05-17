//5-16-2016 jchoy v0.124 cookie
function RecentList(){
    this.assets= [];
    this.cookieName= "tsRecent";
    var $t=this;
    this.addItem= function(s, onclickFcn){
        this.onclickFcn= onclickFcn;
        if (!s) {
        } else if (-1 == (this.assets.toString()+",").indexOf(s+","))
            this.assets.push(s);
        this.displayList();
        document.cookie= this.cookieName+"="+this.assets.toString();
    }
    this.displayList= function(){
        if (!this.div) this.div= this.addEl("div");
        this.div.innerHTML='';
        this.cookieAsset();
        for (var i=0,at=this.assets; i<at.length; i++){
            this.addEl("a",this.div).innerHTML= at[i];
            this._.href= "#"+at[i];
            this._.payload= at[i];
            this._.style.padding= "0 3 0 3";
            this._.onclick= function(){$t.onclickFcn(this.payload)};
        }
    }
    this.cookieAsset = function( ){
        if (this.assets.length>0) return;
        var at= document.cookie.split( this.cookieName+"=" );
        if (at.length<2) return;
        this.assets= at[1].split(";")[0].split(",");
    }
    this.addEl = function( tag, par ){
        if (!par) par=document.body;
        return this._= par.appendChild( document.createElement(tag) );
    }
}
