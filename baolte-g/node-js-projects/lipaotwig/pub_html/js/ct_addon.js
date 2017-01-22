//——-
CmdMod03= function(cap){
  this.cap=cap;
  this.doCmd= function( at ){
    if (at[0] == 'foo')  return 'duck';
    if (at[0] == 'clear') {
      while (this.cap.rows.length>1)
        this.cap.deleteRow(1);
      return this.cap.rows.length;
    }
    if (at[0] == 'select') {
      var fn= function(){
          var rng=document.createRange(), sel= window.getSelection();
          rng.selectNodeContents(this);
          sel.addRange( [rng, sel.removeAllRanges()][0]);
      }
      for (var i=1, at=this.cap.rows; i<at.length; i++)
        at[i].cells[0].onmouseup= fn;
      return 'ok4';
    }
  }
}
tmpfs.write( 'cmdmods.txt', 'CmdMod03' );
