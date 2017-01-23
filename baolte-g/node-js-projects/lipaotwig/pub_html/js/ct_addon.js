//1-22-2017
//===
CmdMod03= function(cap){
  this.cap=cap;
  this.doCmd= function( at ){
    if (at[0] == 'foo')  return 'hello';
    if (at[0] == 'clear') {
      while (this.cap.rows.length>1) this.cap.deleteRow(1);
      return this.cap.rows.length;
    }
  }
}
tmpfs.write( 'cmdmods.txt', 'CmdMod03' );
