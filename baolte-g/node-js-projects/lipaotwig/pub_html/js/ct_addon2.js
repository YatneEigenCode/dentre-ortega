//1-28-2017 t0.174 TsJs
//===
CmdMod03= function(cap){
  this.cap=cap;
  this.doCmd= function( at ){
    var a0= at[0].toUpperCase();
    if (a0 == 'ECHO')  return at.slice(1,99).join(' ');
    if (a0 == 'CLEAR') {
      while (this.cap.rows.length>1) this.cap.deleteRow(1);
      return this.cap.rows.length;
    }
    if (a0 == 'CONFIG') return "<div ignite=ConfigEditor />";
    if (a0 == 'SELECT') {
      for (var i=1,st=new SelectElText(); !(i >= this.cap.rows.length); i++)
        st.setupEvent( this.cap.rows[i].cells[0] )
      return this.cap.rows.length;
    }
  }
}
//===
SelectElText= function(){
  this.setupEvent= function( el ){  el.onmouseup= fn; }
  var fn= function(){
    var rng=document.createRange(), sel= window.getSelection();
    rng.selectNodeContents(this);
    sel.addRange( [rng, sel.removeAllRanges()][0]);
  }
}
//===
ConfigEditor= function(){
  new SnAppFdn().inherit( this, SnAppFdn );
  this.fields= 'url,id,template,param1,param2';
  this.init= function(div){
    var f={}, tbl= this.addEl( 'table', div );
    for (var r,i=0,at=this.fields.split(','); !(i>=at.length); i++){
      (r=tbl.insertRow(i)).insertCell(0);
      r.insertCell(0).innerHTML= at[i];
      f[at[i]]=this.addEl('input',r.cells[1]);
    }
    
    this.pinButton( this.addEl('input',div), f );
  }
  this.pinButton= function(btn, f){
    btn.value= 'Save';
    btn.type= 'button';
    btn.inputs= f;
    btn.onclick= function(){
      var payload={};
      for (var m in this.inputs)
        payload[m]= this.inputs[m].value;
      tmpfs.write( 'test.cfg', JSON.stringify(payload) );
    }
  }
}
tmpfs.write( 'cmdmods.txt', 'CmdMod03' );

//===
CmdMod05= function(cap){
  this.cap= cap;
  this.doCmd= function(at){
    var a0=at[0].toUpperCase();
    if (a0=="FEED") return "<div ignite=TSFeed num="+at[1]+" />"
    if (a0=="TSJS") return new TsJs().start(at[1]);
    if (a0=="RUNONCE") return new RunOnce().start(this.cap);
  }
}
//===
RunOnce= function(){
  var $t= this;
  this.start= function(cap){
    this.cap= cap;
    tmpfs.addEventListener( function(e){$t.onFsMod(e)}, "FILEMOD" );
    return "setup done";
  }
  this.onFsMod= function(ev){
    if (ev.message !='runonce.txt') return;
    if (!tmpfs.exist(ev.message)) return;
    var at= tmpfs.read(ev.message).split("\n");
    for (var c=this.cap,i=0; i<at.length; i++) {
      tmpfs.log( "log", "runonce "+at[i] );
      c.igniteDiv( c.writeRow(at[i],c.doCmd(at[i])) );
    }
  }
}
//===
TsJs= function(){
  new SnAppFdn().inherit( this, SnLiteLoader );
  this.start= function(num){
    if (!num) num="2415";
    var cfg= JSON.parse(tmpfs.read("ts.cfg"));
    var ur= cfg.readverb.replace("{0}",num);
    this.loadJs( cfg.urlbase+ur );
    return "loadjs "+num;
  }
}
//===
TSFeed= function(){
  new SnAppFdn().inherit( this, SnAppFdn );
  var $div;
  this.init= function(div){
    div.innerHTML= "loading...";
    for (var m in this) div[m] = this[m];
    var res= ($div=div).getAttribute("num");
    div.webget( (res==="undefined")? "2411":res, "ts.cfg");
  }
  this.webget= function(num, fn){
    var cfg= JSON.parse(tmpfs.read(fn));
    tmpfs.addEventListener(this.evtFcn, "FILEMOD");
    var ur= cfg.readverb.replace("{0}",num);
    new SnLiteLoader().loadJs( cfg.urlbase+ur );
  }
  this.evtFcn= function(ev){
    if (ev.message != "ts-data.txt") return;
    $div.innerHTML= ev.message;
    $div.innerHTML= tmpfs.read( ev.message );
    tmpfs.removeEventListener($div.evtFcn, "FILEMOD");
  }
}
tmpfs.write("cmdmods.txt","CmdMod05");
tmpfs.log("log","t0.174");
