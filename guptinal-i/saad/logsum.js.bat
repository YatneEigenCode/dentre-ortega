/*
rem 9/21/2015 JChoy v0.2.128 cutoff on oldest existing file
rem 8/27/2015 JChoy v0.2.127 link to next day
rem 7/28/2015 JChoy catalog new log files in folder and prep for quick viewing

set folder=C:\abc\logs
for /f "tokens=1,2 delims==" %%A in (%~n0.config) do if not (%%A)==() set %%A=%%B

if not exist %~n0.txt echo.>%~n0.txt
set timestmp=_
for /f "tokens=2,3,4 delims=/ " %%A in ('date /t') do set timestmp=%timestmp%%%C%%A%%B

echo new items>%~n0_new.txt
for /f %%A in ('dir /b %folder%\*') do (
	cscript //nologo //E:JScript %0 %%~nA /filter < %~n0.txt >> %~n0_new.txt
)
for /f %%A in (%~n0_new.txt) do (
	type %folder%\%%A.00 | cscript //nologo //E:JScript %0 %%A /parse >> %~n0.txt
)
for /f %%A in ('dir /b /o:-n %folder%\*') do set oldest=%%~nA
sort %~n0.txt | cscript //nologo //E:JScript %0 %folder% /saad %oldest% > %~n0%timestmp%.html
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
	{mark:"Processing ", value:"unknown"},
	{mark:"err is:", value:"unknown"},
	{mark:"BODY starting at ", value:"unknown"}
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
	var res= ["","DET",this.target];
	for (var i=0; i<this.keys.length; i++)
		res.push(this.keys[i].value);
	res.push("");
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
		} else if (at[2]==this.target) this.isFound = true;
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
  this.ver= "v0.1.112";
  this.delim= "|";
  this.setupDivs= function(){
	var d$= document;
	this.dataDiv= d$.getElementsByTagName("div")[0];
	this.uiDiv= d$.body.appendChild(d$.createElement("div"));
	this.writeUI( "LogSum "+this.ver )
	this.dataDiv.style.display= "none";
  }
  this.setupData= function(){
	this.data= [];
	var at= this.dataDiv.innerHTML.split("|DET|");
	for (var i=0; i<at.length; i++)
	    if ((at[i] != "") && (at[i].indexOf("|")>0))
		this.data.push(at[i].split(this.delim));
  }
  this.writeUI= function(s, color, bgColor){
	var res= this.uiDiv.appendChild(document.createElement("div"));
	res.innerHTML= s;
	if (bgColor) res.style.backgroundColor= bgColor;
	if (color) res.style.color= color;
	return res;
  }
}
//Jobs, errors, last10, search
//-----
SaadMozDiv1=function SaadMozDiv1(hpath){
  this.constructor= SaadMozDiv;
  this.constructor();
  this.ver= "v0.2.127";
  this.hpath= hpath;
  this.start= function(){
	this.setupDivs();
	this.setupData();
	this.writeUI( this.countItems() );
	this.writeUI( this.countErrs() );
	this.showDateRange();
	this.showJobs();
  }
  this.countErrs= function(){
	var res=0;
	for (var i=0; i<this.data.length; i++)
		if (this.data[i][2]=="'0' "){
		} else if (this.data[i][2]=="unknown") {
		} else res++;
	return "Total Errors: "+res;
  }
  this.countItems= function(){
	return "Total Items: "+this.data.length;
  }
  this.showDateRange= function(){
	this.writeUI( "Date Range:" );
	this.writeUI( this.data[0][3] );
	this.writeUI( this.data[this.data.length-1][3] );
	this.writeUI( "Next Day" ).onclick= this.loadNextDay;
  }
  this.loadNextDay= function(){
	var fn=(location+"").split("/").reverse()[0];
	var s= fn.match(/_(\d)*/)[0].substr(1);
	var dt= new Date([s.substr(0,4),s.substr(4,2),s.substr(6)].join("/"));
	dt.setDate( dt.getDate()+1 );
	var res= dt.toISOString().substr(0,10).replace(/-/g,"");
	location = fn.replace(/_(\d)*/,"_"+res);
  }
  this.groupByJob= function(){
	if (this.groups) return;
	var gg= this.groups = {};
	for (var i=0,td=this.data; i<td.length; i++) {
		if (!gg[td[i][1]]) gg[td[i][1]]=new Array();
		gg[td[i][1]].push( td[i] );
	}
  }
  this.showJobs= function(){
	this.groupByJob();
	var at= [];
	for (var m in this.groups)
		at.push(m);
	this.writeUI( "All Jobs:", "white", "gray" );
	for (var i=0,x=at.sort(); i<at.length; i++)
		this.niceJob( this.groups[at[i]] );
  }
  this.niceClickable= function( nicel, color ){
	var el= this.writeUI( nicel.join(" * "), color);
	el.targetRec= nicel;
	el.targetPath= this.hpath;
	el.onclick= this.handleDblClickForJob;
	el.onmouseover= this.onMouseOverForEl;
	el.onmouseout= this.onMouseOutForEl;

	if (nicel[1].indexOf("CHK_")>0) {
	} else if (nicel[1].indexOf("CK_")>0) {
	} else 
		el.style.fontWeight= "bold";
  }
  this.onMouseOverForEl= function(){
	this.style.backgroundColor="lightgray";
  }
  this.onMouseOutForEl= function(){
	this.style.backgroundColor= document.body.style.backgroundColor;
  }
  this.handleDblClickForJob= function( ){
	var path= this.targetPath;
	if (!this.firstClickTime) {
		this.firstClickTime = new Date().valueOf();
		return;
	}
	if (isNaN(this.firstClickTime)) return;
	if (new Date().valueOf()-this.firstClickTime < 500)
		window.open(path+this.targetRec[0]+".00");
	this.firstClickTime = null;
  }
  this.niceJob= function( jobRec ){
	this.niceJob1( jobRec[jobRec.length-1] );
	for (var ll,i=jobRec.length-2; i>=0; i--){
		ll = jobRec[i];
		if (ll[2] != "'0' ") this.niceJob1( ll );
	}
  }
  this.niceJob1= function( ll ){
	var nicel= [ll[0],ll[1],ll[3]];
	var now24= new Date(new Date().valueOf()-32000*3600);
	if (new Date(ll[3].substr(0,23)).valueOf()>now24) nicel[3]="new";
	if (ll[1] == "unknown") 
		return;
	if (ll[2] != "'0' ") nicel[3]="ERR";
	if (nicel[3]=="new")
		this.niceClickable( nicel,"blue");
	else if (nicel[3]=="ERR")
		this.niceClickable( nicel,"red");
	else 
		this.niceClickable( nicel,"black");
  }
}//class
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
if (WScript.Arguments(1)=="/saad"){
	WScript.echo( "<body><div>" );
	var cutoff = WScript.Arguments(2);
	while (!WScript.StdIn.AtEndOfStream) {
		var sline = WScript.StdIn.ReadLine();
		if (sline.split("|")[2] >= cutoff)
			WScript.echo( sline );
	}
	WScript.echo( "</div></body>" );
	var cnCsv="SaadMozDiv,SaadMozDiv1"
	var startCmd= "new SaadMozDiv1('$hpath').start()";
	var arg0 = WScript.Arguments(0).replace(/\\/g,'/');
	startCmd= startCmd.replace("$hpath",arg0+"/");
	WScript.echo( new SaadFactory(startCmd).genCode(
		["SaadMozDiv","SaadMozDiv1"]) );
}
