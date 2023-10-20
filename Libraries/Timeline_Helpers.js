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

/** CALCULATING FUNCTIONS */

function calcAmortArray(loanAmount, interestPercent, paymentAmount) {
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
        console.error(`[calcAmortArray] Error calculating amortization array: ${e}`);
        return null;
    }

    return array;
}

function getTimeline(loans) {
    let loan, monthlyPayment, amortArray;
    let timeline = [];


    if (loans.length > 0) {
        for (let i in loans) {
            loan = loans[i];
            let { name, loanAmount, interestRatePercent, termLength } = loan;
            monthlyPayment = Helpers.Math.GetPaymentAmount(loanAmount, interestRatePercent, termLength);
            amortArray = calcAmortArray(loanAmount, interestRatePercent, monthlyPayment);
            let obj = {
                name: name, 
                amortArray:  amortArray,
                stats: new amortStats(amortArray)
            };
            timeline.push(obj);
        }
    }

    return timeline;
}

/** RUN PART */

// calcAmortArray(240_900, 3.75, 1_150);

let loans = [
    {
        name: "Car loan 1 - Legacy",
        loanAmount: 10_000, 
        interestRatePercent: 3.75,
        termLength: 6 * NUM_MONTHS_IN_YEAR
    },
    {
        name: "Car loan 2 - Cruze",
        loanAmount: 8_000, 
        interestRatePercent: 4.25, 
        termLength: 6 * NUM_MONTHS_IN_YEAR
    },
    {
        name: "Student loan 1",
        loanAmount: 900, 
        interestRatePercent: 3.00, 
        termLength: 10 * NUM_MONTHS_IN_YEAR
    },
    {
        name: "Student loan 2",
        loanAmount: 3_000, 
        interestRatePercent: 3.00,
        termLength: 10 * NUM_MONTHS_IN_YEAR
    },
    {
        name: "Student loan 3",
        loanAmount: 5_500, 
        interestRatePercent: 3.25, 
        termLength: 10 * NUM_MONTHS_IN_YEAR
    },
    {
        name: "Student loan 4",
        loanAmount: 7_500, 
        interestRatePercent: 2.75, 
        termLength: 10 * NUM_MONTHS_IN_YEAR
    },
    {
        name: "Student loan 5",
        loanAmount: 6_000, 
        interestRatePercent: 3.75, 
        termLength: 10 * NUM_MONTHS_IN_YEAR
    }, 
    {
        name: "Home loan", 
        loanAmount: 249_000, 
        interestRatePercent: 3.75,
        termLength: 30 * NUM_MONTHS_IN_YEAR
    }
]

let loansShort = [
    {
        name: "Car loan 1 - Legacy",
        loanAmount: 10_000, 
        interestRatePercent: 3.75,
        termLength: 6 * NUM_MONTHS_IN_YEAR
    }
];

let timeline = getTimeline(loans);

for (var i in timeline) {
    console.log(`Loan name: ${timeline[i].name}\n\t${timeline[i].stats.toString()}`);
}