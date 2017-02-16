//2-15-2017 v0.125 TmpfsEdit
CmdMod0214= function(cap){
  this.doCmd=function(at){
    if (at[0].toUpperCase()=="EDIT") {
      return "<div ignite=TmpfsEdit />";
    }
  }
}
tmpfs.write( "cmdmods.txt", "CmdMod0214" );
TmpfsEdit= function(){
  new SnAppFdn().inherit( this, SnAppFdn );
  $t= this;
  this.init= function(div){
    this.addEl( "select", div ).onchange= this.selItem;
    this._.add( new Option("Choose File") );
    for (var i=0,at=tmpfs.list().split(","); i<at.length; i++)
      this._.add( new Option(at[i],at[i]) );
    this._.onclick= this.noPropagate;
  }
  this.noPropagate= function(e){e.stopPropagation()}
  this.selItem= function(){
    var fn= this.options[this.selectedIndex].text;
    new TmpfsTa().makeTa(this.parentNode, fn);
    this.parentNode.parentNode.parentNode.insertCell().innerHTML=fn;
    this.style.display="none";
  }
}
TmpfsTa= function(){
  new SnAppFdn().inherit( this, TmpfsEdit );
  this.init= function(ta,fn){
    for (var m in this) ta[m]=this[m];
    ta.value= [tmpfs.read(ta.filename=fn),ta.onclick= this.noPropagate][0];
  }
  this.makeTa= function(par,fn){ this.init(this.addEl("textarea",par),fn); }
  this.onkeypress= function(){
    var $t=this, x1=this.style.borderWidth="medium";
    if (!this.isDirty) this.isDirty=[1,setTimeout( function(){$t.doSave()}, 5000 )][0];
  }
  this.doSave= function(){
    if (this.isDirty) tmpfs.write(this.filename,this.value);
    var $t=this, x1=this.isDirty= false, x2=this.style.borderWidth="thin";
  }
}
CmdMod0210= function(cap){
  this.doCmd=function(at){
    if (at[0].toUpperCase()=="DLBAK") {
      return "<div ignite=DLBak />";
    }
  }
}
tmpfs.write( "cmdmods.txt", "CmdMod0210" );
DLBak= function(){
  new SnAppFdn().inherit( this, SnAppFdn );
  this.filename= "dlbak.txt";
  this.asset= {};
  $t= this;
  this.init= function(div){
    this.addEl( "a", div ).innerHTML=this.filename;
    this._.download= this.filename;
    var $u= div;
    this.addEl( "input", div ).type= "file";
    this._.onchange= function(){$t.useFile(this.files)};
    tmpfs.addEventListener( function(e){$u.onFsMod(e)}, 'FILEMOD' );
    for (var m in this) div[m]=this[m];
  }
  this.onFsMod= function(e){
    if ((!this.isWhite(e.message)) || (!tmpfs.exist(e.message))) return;
    this.asset[e.message]= tmpfs.read(e.message);
    var s= "data:text/plain;base64,"+btoa(JSON.stringify(this.asset));
    this.getElementsByTagName("a")[0].href= s;
  }
  this.isWhite= function(fn){
    if (fn==this.filename) return true;
    if (tmpfs.exist(this.filename)) return tmpfs.read(this.filename).indexOf(fn) >= 0;
  }
  this.useFile= function(files){
    var fr= new FileReader();
    fr.onload= function(evt){ $t.loadAsset(evt.target.result) }
    if (files.length>0) fr.readAsText(files[0]);
  }
  this.loadAsset= function(s){
    this.asset= JSON.parse(s);
    for (var m in this.asset) tmpfs.write( m, this.asset[m] );
  }
}
