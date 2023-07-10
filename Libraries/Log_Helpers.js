var Log = {};

Log.Info = function (printString) 
{
    console.log(printString);
}

Log.Debug = function (printString) {
    if (DEBUG) {
        console.log(printString);
    }
}

Log.Warn = function (printString) {
    console.warn(printString);
}

Log.Error = function (printString) {
    console.error(printString);
}