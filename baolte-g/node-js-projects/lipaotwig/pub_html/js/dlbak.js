//2-9-2017  DLBak-backup tmpfs via download link; restore via upload
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
    if (!this.isWhite(e.message)) return;
    if (!tmpfs.exist(e.message)) return;
    this.asset[e.message]= tmpfs.read(e.message);
    var s= "data:text/plain;base64,"+btoa(JSON.stringify(this.asset));
    this.getElementsByTagName("a")[0].href= s;
  }
  this.isWhite= function(fn){
    if (fn==this.filename) return true;
    if (!tmpfs.exist(this.filename)) return false;
    var at=tmpfs.read(this.filename).split(unescape("%0A"));
    for (var i=0; i<at.length; i++)
      if (at[i]==fn) return true;
    return false;
  }
  this.useFile= function(files){
    if (files.length==0) return;
    var fr= new FileReader();
    fr.onload= function(evt){ $t.loadAsset(evt.target.result) }
    fr.readAsText(files[0]);
  }
  this.loadAsset= function(s){
    this.asset= JSON.parse(s);
    for (var m in this.asset) tmpfs.write( m, this.asset[m] );
  }
}
