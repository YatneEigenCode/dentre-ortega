//5-16-2016 jchoy v0.121 RecentList
function RecentList(){
    this.assets= [];
    var $t=this;
    this.addItem= function(s, onclickFcn){
        this.onclickFcn= onclickFcn;
        if (-1 == (this.assets.toString()+",").indexOf(s+","))
            this.assets.push(s);
        this.displayList();
    }
    this.displayList= function(){
        if (!this.div) this.div= this.addEl("div");
        this.div.innerHTML='';
        for (var i=0,at=this.assets; i<at.length; i++){
            this.addEl("a",this.div).innerHTML= at[i];
            this._.href= "#"+at[i];
            this._.payload= at[i];
            this._.style.padding= "0 3 0 3";
            this._.onclick= function(){$t.onclickFcn(this.payload)};
        }
    }
    this.addEl = function( tag, par ){
        if (!par) par=document.body;
        return this._= par.appendChild( document.createElement(tag) );
    }
}
