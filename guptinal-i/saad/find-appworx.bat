@echo off
rem find-appworx.bat 1/11/2016 JChoy find new UC4 log file containing APPWORX

set uc4out=d:\uc4\am8\out
set found=_none_
set target="source         APPWORX"
set logfile=logs\%~n0.log

echo find new APPWORX and capture in %logfile%
for /F "tokens=1,2,3" %%A in ('find /C /I %target% %uc4out%\*.00') do if not (%%C)==(0) set found=%%~nB
if (%found%)==(_none) goto :end

:foundAppworx
 echo found %found%.00
 if not exist %logfile% goto :foundNew
 for /F %%A in (%logfile%) do if (%found%.00)==(%%A) goto :end

:foundNew
 date /t >>%logfile%
 echo %found%.00 >>%logfile%
 set errorlevel=9

