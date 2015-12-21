//Extracts specified columns from pipe delimited file.
//Usage: cscript fileop.js fileop-ExtractCols.js 1,0,5 <in.txt
//-----
MyOp= function(){
  this.delim= "|";
  this.iu= new IU();
  this.col= this.iu.getArg(1);
  if (!this.col) this.col= "0,1";
  this.acol = this.col.split(",");
  this.doLine= function(s){
	var at=s.split( this.delim );
	var ao=[];
	for (var i=0; i<this.acol.length; i++)
		ao[i]= at[this.acol[i]];
	this.iu.write(ao.join(this.delim));
  }
  this.flush= function(){}
}
