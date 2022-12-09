echo off

:: param %1 day number (e.g. day3)
:: param %2 puzzle name (e.g. messageDecoder)
mkdir %1
xcopy ".\template.html" ".\%1\index.html" /-I
xcopy ".\puzzleInput.js" ".\%1\puzzleInput.js" /-I
xcopy ".\template.js" ".\%1\%2.js" /-I