var Helpers = Helpers || {};
Helpers.Math = Helpers.Math || {};

Helpers.Math.Round = function (numberToBeRounded, precision) {
    return Math.round(numberToBeRounded * Math.pow(10, precision)) / Math.pow(10, precision);
}


