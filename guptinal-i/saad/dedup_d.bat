rem dedup.bat 12/18/2015
rem batch to check data, entirely written by Gilead worker.
rem @echo off

set cur=
set tags=
for /F "tokens=1,2" %%A in (%1) do call :sub %%A %%B
echo %cur% %tags% >> dedup_d.txt
goto :eof

:sub
  if not [%cur%]==[%1] echo %cur% %tags% >> dedup_d.txt
  if not [%cur%]==[%1] set tags=
  set cur=%1
  set tags=%tags%_%2
goto :eof
