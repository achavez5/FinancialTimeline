const NUM_MONTHS_IN_YEAR = Helpers.Math.NumMonthsInYear;
const round = Helpers.Math.Round;

/** CLASS DEFS*/
class amortArrayRecord {
    constructor(loanAmount, interestPayment, payment, principalPayment) {
        [this.loanAmount, this.interestPayment, this.payment, this.principalPayment] = [loanAmount, interestPayment, payment, principalPayment];
    }
    getInterestAmount () { return this.interestPayment };
    getPayment () { return this.payment };
    getLoanAmount () { return this.loanAmount};
    toString () {
        return `\n\tPrincipal Amount: ${round(this.loanAmount)} \n\tInterest Paid: ${round(this.interestPayment)} \n\tPrincipal Paid: ${round(this.principalPayment)} \n\tMonthly payment: ${this.payment}`;
    };
}

class amortStats {
    constructor(amortArr) {
        let interestSum = 0;
        let paymentSum = 0;
        let record; 
       
        if (amortArr.length > 0) {
            for (let i in amortArr) {
                record = amortArr[i];

                if (i == 0) {
                    this.originalLoanBalance = record.getLoanAmount();
                }

                let recordInterest = record.getInterestAmount();
                let recordPayment = record.getPayment();
    
                interestSum += recordInterest; 
                paymentSum += recordPayment;
            }
        }
    
        this.totalInterestPaid = round(interestSum); 
        this.totalPaid = round(paymentSum);
    }
    toString() {
        return `Original loan amount: ${this.originalLoanBalance}\n\tTotal paid over the life of the loan: ${this.totalPaid}\n\tTotal interest paid: ${this.totalInterestPaid}`;
    }
};

Helpers.Timeline = {
    CalcAmortArray: function (loanAmount, interestPercent, paymentAmount) {
        let interestAmount, principalPayment; 
        let array = [];
        let interestRatePerMonth = (interestPercent / 100) / NUM_MONTHS_IN_YEAR;

        // push full amount as the "start" of the array
        array.push(new amortArrayRecord(loanAmount, 0.00, 0.00, 0.00));
    
        try {
            while (loanAmount > 0) {
                let amortRecord;
                interestAmount = loanAmount * interestRatePerMonth;
                principalPayment = round(paymentAmount - interestAmount);
                loanAmount = round(loanAmount - principalPayment);
                paymentAmount = round(loanAmount > 0 ? paymentAmount : loanAmount + principalPayment + interestAmount);
                
                // round interest for saving purposes
                interestAmount = round(interestAmount);

                // fail if you can't pay off the amount
                if (principalPayment < 0) {
                    throw new Error("Payment in interest is greater than monthly payment. This loan will never be paid off");
                }

                amortRecord = new amortArrayRecord(
                    loanAmount > 0 ? loanAmount : 0, 
                    interestAmount, 
                    paymentAmount,
                    principalPayment
                );
                
                array.push(amortRecord);
            }
        } catch (e) {
            Log.Error(`[calcAmortArray] Error calculating amortization array: ${e}`);
            return null;
        }

        return array;
    },
    GetTimeline: function (loans) {
        let loan, monthlyPayment, amortArray;
        let timeline = [];


        if (loans.length > 0) {
            for (let i in loans) {
                loan = loans[i];
                let { name, loanAmount, interestRatePercent, termLength } = loan;
                monthlyPayment = Helpers.Math.GetPaymentAmount(loanAmount, interestRatePercent, termLength);
                // Log.Warn(`montlyPayment ${monthlyPayment}`);
                amortArray = this.CalcAmortArray(loanAmount, interestRatePercent, monthlyPayment);
                // Log.Warn(`amortArray ${amortArray}`);

                let obj = {
                    name: name, 
                    amortArray:  amortArray,
                    stats: new amortStats(amortArray)
                };

                timeline.push(obj);
            }
        }

        return timeline;
    },
}
