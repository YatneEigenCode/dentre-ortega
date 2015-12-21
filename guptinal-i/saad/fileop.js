//Purpose: loop thru text file and apply method on each line
//12-19-2015	JChoy v0.112 set up architecure; use without bat
//12-21-2015	JChoy v0.124 re-architected to load external code

//-----
function MyOp(){
  this.popu= new IU();
  this.doLine= function(s){
	this.popu.write(s);
  }
  this.flush= function(){}
}

//-----
IU= function() {
  this.write= function(s){
	WScript.echo( s );
  }
  this.getArg= function(n){
	return (n>=gjo.argCount)? null : WScript.arguments(n);
  }
  this.loadClass= function(fn){
	fso=WScript.createObject("scripting.filesystemobject");
	eval(fso.openTextFile( fn, 1 ).readAll());
  }
}

//-----
gjo = {
	argCount: WScript.arguments.length
	,iu:	new IU()
	,myop:	new MyOp()
}
if (gjo.argCount>=1){
	gjo.iu.loadClass( gjo.iu.getArg(0) );
	gjo.myop= new MyOp();
}

//-----
while (!WScript.StdIn.AtEndOfStream)
	gjo.myop.doLine( WScript.StdIn.ReadLine() );
gjo.myop.flush();
