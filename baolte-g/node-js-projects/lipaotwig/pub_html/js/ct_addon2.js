//1-22-2017 ConfigEditor
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
