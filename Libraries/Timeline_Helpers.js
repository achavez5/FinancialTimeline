const NUM_MONTHS_IN_YEAR = 12;
const ROUNDED_ZERO = round(0.00);

/** HELPERS */

function round(numberToBeRounded, precision = 2) {
    return Math.round(numberToBeRounded * Math.pow(10, precision)) / Math.pow(10, precision);
};

/** CLASS DEFS*/

class amortArrayRecord {
    constructor(loanAmount, interestPayment, payment, principalPayment) {
        // console.log(`Amort array initialization ${loanAmount, interestPayment, payment, principalPayment }`);
        [this.loanAmount, this.interestPayment, this.payment, this.principalPayment] = [loanAmount, interestPayment, payment, principalPayment];
    }
    getInterestAmount () { return this.interestPayment };
    getPayment () { return this.payment };
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
        return `Total interest paid: ${this.totalInterestPaid}\n\tTotal paid over the life of the loan: ${this.totalPaid}`;
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
                loanAmount > 0 ? loanAmount : ROUNDED_ZERO, 
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

// p = principal 
// i = interest rate / 100
// n = number of payments per term (normally months in year)
// t = number of periods (term length is usually measured in years)
//
//Formula: 
//        p * ( i / n )
// ____________________________
// 1 - (1 + ( i / n ))^-(n * t)
//
function getPaymentAmount(principalPayment, interestRate, termLengthInMonths) {
    let monthlyInterestRate = (interestRate / 100) / NUM_MONTHS_IN_YEAR; 
    let numerator = principalPayment * monthlyInterestRate;
    let denominator = (1.0 - Math.pow(1.0 + monthlyInterestRate, -(termLengthInMonths)));
    
    return round(numerator / denominator, 2);
}


function getTimeline(loans) {
    let loan, monthlyPayment, amortArray;
    let timeline = [];


    if (loans.length > 0) {
        for (let i in loans) {
            loan = loans[i];
            let { name, loanAmount, interestRatePercent, termLength } = loan;
            monthlyPayment = getPaymentAmount(loanAmount, interestRatePercent, termLength);
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