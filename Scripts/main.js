const NUM_MONTHS_IN_YEAR = 12;
const SPACE_CHAR = ' '; 
const LANG = "en";
const DEBUG = false;

// Calculates and returns an array of elements representing months until the loan is paid 
function createAmortizationTable(startingAmount, payment, interestRate) {
    let amortizationArr = [];

    amortizationArr.push({
        interestAmount: 0,
        principalPayment: 0,
        monthStartingAmount: startingAmount, 
        monthEndAmount: startingAmount
    })

    while (startingAmount > 0) {
        let interestAmount = calculateMonthlyInterest(startingAmount, interestRate);
        let principalPayment = payment - interestAmount;
        let afterPaymentAmount = startingAmount + interestAmount - payment;
        amortizationArr.push({
            interestAmount: interestAmount,
            principalPayment: principalPayment,
            monthStartingAmount: startingAmount,
            monthEndAmount: afterPaymentAmount > 0 ? afterPaymentAmount : 0
        });
        startingAmount = afterPaymentAmount;
    }
    return amortizationArr;
}

function calculateMonthlyInterest(amount, interestRate) {
    let notRoundedInterest = ((interestRate / 100)/ NUM_MONTHS_IN_YEAR) * amount;
    let roundedInterest = Math.round(notRoundedInterest * 100) / 100;
    return roundedInterest;  
}

function logInfo(toLog) {
    console.log(toLog);
}
function logDebug (toLog) {
    if (DEBUG) {
        console.log(toLog);
    }
}

// ##### RUN PART #####

// TODO: remove below here
function padValueWithSpaces(value, numOfSpaces) {
    let stringRepOfVal = value.toLocaleString("en");
    // logDebug(`>> ${stringRepOfVal} ${numOfSpaces} ${stringRepOfVal.length}`); 
    if (stringRepOfVal.length >= numOfSpaces) {
        return stringRepOfVal;
    }
    return SPACE_CHAR.repeat(numOfSpaces - stringRepOfVal.length).concat(stringRepOfVal);
};


// TESTS

// Creation of amortization array 
function test1() { 
    let amortArr = [
        {
            interestAmount: "INTEREST PAID", 
            principalPayment: "PRINCIPAL PAID",
            monthStartingAmount: "STARTING AMOUNT",
            monthEndAmount: "ENDING AMOUNT"
        }].concat(...createAmortizationTable(800, 60, 4));

    logDebug(JSON.stringify(amortArr));
    logDebug(amortArr);

    // generate amortization table representation in HTML
    let amortTableDiv = document.getElementById("amortizationTable");
    for (let i in amortArr) { 
        let month = amortArr[i];
        let newElem = document.createElement("p");
        let fields = [
            padValueWithSpaces(i - 2 > 0 ? i : " ", 15),
            padValueWithSpaces(month.monthStartingAmount,15),
            padValueWithSpaces(month.monthEndAmount,15),
            padValueWithSpaces(month.interestAmount, 15),
            padValueWithSpaces(month.principalPayment, 15)
        ];
        let str = fields.join("|");
        
        logDebug(str);

        newElem.innerHTML = str; 
        newElem.className = "tableThing";
        amortTableDiv.append(newElem);

    }
}
function test2 () {
    
}


// ##### RUN TESTS HERE #####
// test1();
test2(); 