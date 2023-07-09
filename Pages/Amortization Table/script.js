const NUM_MONTHS_IN_YEAR = 12;
const SPACE_CHAR = ' '; 
const LANG = "en";
const DEBUG = false;
const AMORTIZATION_TABLE_HEADERS = ["MONTH", "PAYMENT", "STARTING AMOUNT", "ENDING AMOUNT", "INTEREST PAID", "PRINCIPAL PAID", "TOTAL PAID"];

// Calculates and returns an array of elements representing months until the loan is paid 
// TODO: Figure out why the freak this doesn't look right -> I don't think the calculations are valid
// TODO: Figure out how to assign the right values as you go down the rows 
//          -> Total paid is wrong on the last line because the last amount won't be the same as the regular payment
//              - There WILL be a remainder in almost all cases
function createAmortizationTable(startingAmount, payment, interestRate) {
    let amortizationArr = []; // stores rows of 
    let totalPaid = 0;

    amortizationArr.push({
        interestAmount: 0,
        principalPayment: 0,
        monthStartingAmount: startingAmount, 
        monthEndAmount: startingAmount,
        totalPaid: totalPaid,
        isThisRight: false
    })

    while (startingAmount > 0) {
        let interestAmount = calculateMonthlyInterest(startingAmount, interestRate);
        let principalPayment = payment - interestAmount;
        let afterPaymentAmount = startingAmount + interestAmount - payment;
        totalPaid += payment;
        let rowInfo = {
            interestAmount: interestAmount,
            principalPayment: principalPayment,
            monthStartingAmount: startingAmount,
            monthEndAmount: afterPaymentAmount > 0 ? afterPaymentAmount : 0,
            totalPaid: totalPaid
        };

        amortizationArr.push(rowInfo);

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
    let stringRepOfVal = value.toLocaleString(LANG);
    if (stringRepOfVal.length >= numOfSpaces) {
        return stringRepOfVal;
    }
    return SPACE_CHAR.repeat(numOfSpaces - stringRepOfVal.length).concat(stringRepOfVal);
};


// TESTS

// Creation of amortization array 
function generateTextRepresentationOfTable() { 
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
            padValueWithSpaces(i, 15),
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

function generateHTMLRepresentationOfTable(startingBalance, payment, interestRate) {
    let amortArr = createAmortizationTable(startingBalance, payment, interestRate);
    let amortTableDiv = document.getElementById("amortizationTable");
    let amortTable = document.createElement("table");

    // generate header row for the table
    function getAmortizationTableHeader() {
        let headerRow = document.createElement("tr");
        for (let i in AMORTIZATION_TABLE_HEADERS) {
            let header = document.createElement("th");
            header.innerText = AMORTIZATION_TABLE_HEADERS[i];
            headerRow.appendChild(header);
        }
        return headerRow;
    }

    amortTable.appendChild(getAmortizationTableHeader());

    // generate amortization table representation in HTML
    for (let i in amortArr) { 
        let month = amortArr[i];
        let newRow = document.createElement("tr");
        let fields = [
            i == 0 ? "LOAN START" : i, // month
            i == 0 ? 0 : payment.toLocaleString(LANG),
            month.monthStartingAmount.toLocaleString(LANG), 
            month.monthEndAmount.toLocaleString(LANG),
            month.interestAmount.toLocaleString(LANG),
            month.principalPayment.toLocaleString(LANG),
            month.totalPaid.toLocaleString(LANG)
        ];

        for (let i in fields) {
            let newTableData = document.createElement("td");
            newTableData.innerText = fields[i];
            newRow.appendChild(newTableData);
        }

        amortTable.append(newRow);
    }
    amortTableDiv.appendChild(amortTable);
}


// ##### RUN TESTS HERE #####
// generateTextRepresentationOfTable();
generateHTMLRepresentationOfTable(5000, 200, 20); 