//-----
MyOp= function(){
  this.popu= new IU();
  this.col= this.popu.getArg(1);
  this.col|= 0;
  this.doLine= function(s){
	var at=s.split("|");
	this.popu.write(at[this.col]);
  }
  this.flush= function(){
  }
}
