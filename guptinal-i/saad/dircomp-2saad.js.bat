/*
type %1 | cscript //Nologo //E:JScript %0 >%~n1.html
exit(0)
rem 7/23/2015 JChoy convert fc output to html
*/

//-----
function Fcout2Table(){
    this.atr= ["<tr><td>","</td><td>","</td></tr>"];
    this.i3= 0;
    this.br= function(s){
	return (s=="") ? "" : (s+"<br />");
    }
    this.doLine= function(s){
	if (s.substr(0,5)!="*****") return this.br(s);
	if (this.i3>=3) this.i3=0;
	var br = (this.i3 == 2) ? "":"<br />";
	return this.atr[this.i3++] + s.substr(5)+br;
    }
}
//-----
function SaadMozTable(){
    this.colors=['yellow','white'];
    this.start= function(){
	var tbl = document.getElementsByTagName('table')[0];
	for (var i=0; i<tbl.rows.length; i++){this.mozRow(tbl.rows[i])}
    }
    //filter to ignore certain differences - override this
    this.filter= function(s0, s1){
	return false;
    }
    //attach this method to DOM el to handle event
    this.toggleBg= function(){
	var is0= this.style.backgroundColor==this.mozColors[0];
	this.style.backgroundColor= this.mozColors[ (is0)?1:0 ];
    }
    //row becomes interactive, will change color when clicked.
    this.mozRow= function(rw){
	var s0=rw.cells[0].innerHTML;
	var s1=rw.cells[1].innerHTML;
	if (this.filter(s0,s1)) {
		rw.cells[0].innerHTML= rw.cells[1].innerHTML= "";
	} else {
		rw.mozColors= this.colors;
		rw.style.backgroundColor = this.colors[0];
		rw.onclick=this.toggleBg;
	}
    }//fcn
}
//derived class with custom override
function SaadMozTable1(){
    this.constructor=SaadMozTable;
    this.constructor();
    this.filter= function(s0, s1){
	//custom logic goes here
	var dof = 'Directory of \\\\';
	return (s0.length==s1.length) && (s0.indexOf(dof)>=0) && (s0.indexOf("/")<0);
    }
}
//---spit out SAAD document
WScript.echo("<body><table border=1>");
var f2t= new Fcout2Table();
while (!WScript.StdIn.AtEndOfStream) 
	WScript.echo( f2t.doLine(WScript.StdIn.ReadLine()) );
WScript.echo("</table></body>")

//---spit out code for SAAD
WScript.echo("<script>");
WScript.echo("SaadMozTable="+SaadMozTable.toString() );
WScript.echo("SaadMozTable1="+SaadMozTable1.toString() );
WScript.echo("new SaadMozTable1().start()" );
WScript.echo("</script>");

