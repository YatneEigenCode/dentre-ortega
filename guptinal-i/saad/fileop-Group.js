//-----
MyOp= function(){
  this.prev= {id:"", tags:""};
  this.popu= new IU();
  this.doLine= function(s){
	var at=s.split(" ");
	if (this.prev.id != at[0])
		this.flush()
	this.prev.id= at[0];
	this.prev.tags+= "_"+at[at.length-1];
  }
  this.flush= function(){
	this.popu.write(this.prev.id+" "+this.prev.tags)
	this.prev.tags= "";
  }
}
