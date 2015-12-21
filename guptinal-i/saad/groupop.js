/*
@echo off

cscript //Nologo //E:JScript %0 align-NPI
pause
    
rem exit(0)
goto end
*/

//Purpose: loop thru text file and apply method on each line
//Plan: just add NPI to last column of PUB_CUSTMASTER file

//12-19-2015   JChoy v0.112 set up architecure; use without bat


//-----
function MyOp(){
  this.prev= {id:"", tags:""};
  this.popu= new Popu();
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

//-----
function Popu() {
  this.write= function(s){
	WScript.echo( s );
  }
  this.getArg= function(n){
	return (n>=gjo.argCount)? null : WScript.arguments(n);
  }
}

//-----
gjo = {
	popu: new Popu()
	,argCount: WScript.arguments.length
	,myop: new MyOp()
}

//-----
while (!WScript.StdIn.AtEndOfStream)
	gjo.myop.doLine( WScript.StdIn.ReadLine() );
gjo.myop.flush();
//gjo.popu.write( gjo.argCount );
