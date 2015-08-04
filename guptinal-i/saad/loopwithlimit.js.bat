/*
rem 8-4-2015 JChoy loopwithlimit.js.bat - converting a long for loop to a short loop using js
set folder=c:\Windows

for /f %%A in ('"dir /b /o:d /a:-d %folder%\* | cscript //nologo //e:Jscript %0 /last10"') do echo %%A
pause
*/
if (WScript.Arguments.length==0) {
} else if (WScript.Arguments(0)=="/last10") {
	var zbuf = 10
	var at=new Array(zbuf+1);
	for (var i=0; (!WScript.Stdin.AtEndOfStream); i++){
		at[zbuf]= WScript.Stdin.readLine();
		at.shift();
	}
	WScript.echo( at.join("\n") );
}