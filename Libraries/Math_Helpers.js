Helpers.Math = {
    Round: function (numberToBeRounded, precision = 2) {
        return Math.round(numberToBeRounded * Math.pow(10, precision)) / Math.pow(10, precision);
    },
    // p = principal 
    // i = interest rate / 100
    // n = number of payments per term (normally months in year)
    // t = number of periods (term length is usually measured in years)
    //
    // Formula: 
    //        p * ( i / n )
    // ____________________________
    // 1 - (1 + ( i / n ))^-(n * t)
    //
    GetPaymentAmount: function (principalPayment, interestRate, termLengthInMonths) {
        let monthlyInterestRate = (interestRate / 100) / this.NumMonthsInYear; 
        let numerator = principalPayment * monthlyInterestRate;
        let denominator = (1.0 - Math.pow(1.0 + monthlyInterestRate, -(termLengthInMonths)));

        return this.Round(numerator / denominator, 2);
    },
    NumMonthsInYear: 12,
    MaxNumberOfMonthsInTable: 360,

}

