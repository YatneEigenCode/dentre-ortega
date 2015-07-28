/*
rem 7/28/2015 JChoy catalog new log files in folder and prep for quick viewing
set folder=C:\abc\logs
if not exist %~n0.txt echo.>%~n0.txt
echo new items>%~n0_new.txt
for /f %%A in ('dir /b %folder%\*') do (
	cscript //nologo //E:JScript %0 %%~nA /filter < %~n0.txt >> %~n0_new.txt
)
for /f %%A in (%~n0_new.txt) do (
	type %folder%\%%A.00 | cscript //nologo //E:JScript %0 %%A /parse >> %~n0.txt
)
sort %~n0.txt | cscript //nologo //E:JScript %0 /saad > %~n0.html
pause
exit(0)
*/



//-----
function StdInLooper( workObj ){
    this.workObj = workObj
    this.start= function( meth ){
    	while (!WScript.StdIn.AtEndOfStream) 
		this.workObj[meth](WScript.StdIn.ReadLine());
    }
}
//-----
function ParserWig( fn ){
    this.target = fn;
    this.group = "Unknown";
    this.key= "Processing";
    this.keyRetCd= "log_run is:";
    this.rek2= "BODY starting at";
    this.keys= [
	{mark:"Processing ", value:"unkown"},
	{mark:"err is:", value:"unkown"},
	{mark:"BODY starting at ", value:"unkown"}
	]
    this.parse= function( cline ){
	for (var i=0; i<this.keys.length; i++)
		this.parseKey( this.keys[i], cline );
    }
    this.parseKey= function( keySet, cline ){
	if (keySet.isDone) return;
	var pos= keySet.mark.length;
	if (cline.substr(0,pos)==keySet.mark) {
		keySet.value= cline.substr(pos);
		keySet.isDone= true;
	}
    }
    this.getResult= function(){
	var res= [this.target];
	for (var i=0; i<this.keys.length; i++)
		res.push(this.keys[i].value);
	return res.join("|");
    }
}
//-----
function FilterWig( fn ){
    this.target = fn;
    this.delim = "|";
    this.check= function( cline ){
		var at=cline.split(this.delim);
		if (at.length==0){
		} else if (at[0]==this.target) this.isFound = true;
    }
    this.getResult= function(){
		return (this.isFound)? "" : this.target;
    }
}
//-----
function SaadFactory(startCmd){
	this.startCmd= startCmd;
	this.genCode= function(acn){
		var at = ["<script>"];
		for (var i=0; i<acn.length; i++)
			at.push(acn[i]+"="+eval(acn[i]).toString());
		at.push(this.startCmd);
		at.push("</script>");
		return at.join("\n");
	}
}
//-----
SaadMozDiv=function SaadMozDiv(){
  this.setupDivs= function(){
	var d$= document;
	this.dataDiv= d$.getElementsByTagName("div")[0];
	this.uiDiv= d$.body.appendChild(d$.createElement("div"));
	this.uiDiv.innerHTML= "Welcome";
	this.dataDiv.style.display= "none";
  }
}
//Jobs, errors, last10, search, count, range
SaadMozDiv1=function SaadMozDiv1(){
  this.constructor= SaadMozDiv;
  this.constructor();
  this.start= function(){
	this.setupDivs();
  }
}

//-----
//for (var i=0; i<WScript.Arguments.length; i++) WScript.Echo( i+": "+WScript.Arguments(i) );
if (WScript.Arguments.length>1) {
    if (WScript.Arguments(1)=="/filter"){
	var fw = new FilterWig( WScript.Arguments(0) );
	new StdInLooper( fw ).start( "check" );
	if (fw.getResult()) WScript.echo( fw.getResult() );
    }
    if (WScript.Arguments(1)=="/parse"){
	var pw = new ParserWig( WScript.Arguments(0) );
	if (pw.target!="new") {
		new StdInLooper( pw ).start( "parse" );
		WScript.echo( pw.getResult() );
	}
    }
}
if (WScript.Arguments(0)=="/saad"){
	WScript.echo( "<body><div>" );
	while (!WScript.StdIn.AtEndOfStream) 
		WScript.echo( WScript.StdIn.ReadLine() );
	WScript.echo( "</div></body>" );
	var cnCsv="SaadMozDiv,SaadMozDiv1"
	WScript.echo( new SaadFactory("new SaadMozDiv1().start()").genCode(
		["SaadMozDiv","SaadMozDiv1"]) );
}
