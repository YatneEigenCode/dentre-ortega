/*
rem 8-4-2015 JChoy loopwithlimit.js.bat - converting a long for loop to a short loop using js
set folder=c:\Windows

echo.>%~n0.txt
for /f %%A in ('"dir /b /o:d /a:-d %folder%\* | cscript //nologo //e:Jscript %0 /last10 25"') do echo %%A >>%~n0.txt
pause
*/
//----
function checkArg( num, val ){
	if (WScript.Arguments.length <= num) return false;
	if (val) return (WScript.Arguments(num) == val);
	return WScript.Arguments(num);
}
function echoLast10() {
	var z1 = parseInt(checkArg(1));
	var zbuf = (isNaN(z1))? 10 : z1;
	var at=new Array(zbuf+1);
	for (var i=0; (!WScript.Stdin.AtEndOfStream); i++){
		at[zbuf]= WScript.Stdin.readLine();
		at.shift();
	}
	WScript.echo( at.join("\n") );
}//fcn

if (checkArg( 0, "/last10" )) echoLast10();

