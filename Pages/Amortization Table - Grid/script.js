const NUM_MONTHS_IN_YEAR = 12;
const SPACE_CHAR = ' '; 
const LANG = "en";
const DEBUG = false;
const AMORTIZATION_TABLE_HEADERS = ["MONTH", "PAYMENT", "START", "END", "INTEREST", "PRINCIPAL", "TOTAL"];

// Helpers
const NUM_MONTHS_IN_YEAR = Helpers.Math.NumMonthsInYear;
const MAX_NUMBER_OF_MONTHS = Helpers.Math.MaxNumberOfMonthsInTable;

function createTableCell() {
    let tableCell = document.createElement("div");
    tableCell.setAttribute("class", "tableCell");
    return tableCell;
}

// Calculates and returns an array of elements representing months until the loan is paid 
function createAmortizationTable(startingAmount, payment, interestRate, tableId) {
    // generate header row for the table
    function setAmortizationTableHeader(table) {
        for (let i in AMORTIZATION_TABLE_HEADERS) {
            let header = createTableCell();
            header.setAttribute("id", "tableHeaderCell");
            header.innerText = AMORTIZATION_TABLE_HEADERS[i];
            table.appendChild(header);
        }
    }
    function createAmortTableRow(month, rowPayment, rowStartingAmount, rowEndingAmount, rowInterestPaid, rowPrincipalPaid, totalPaid, table) { 
        function createRowData(value) {
            let newTableData = createTableCell();
            newTableData.innerText = value;
            table.appendChild(newTableData);
        }
        
        const formatter = Helpers.Common.FormatToDollar;

        createRowData(month); // createRowData(month && month > 0 ? month : "LOAN START"); 
        createRowData(formatter.format(rowPayment || 0));
        createRowData(formatter.format(rowStartingAmount || 0)); 
        createRowData(formatter.format(rowEndingAmount || 0));
        createRowData(formatter.format(rowInterestPaid || 0));
        createRowData(formatter.format(rowPrincipalPaid || 0));
        createRowData(formatter.format(totalPaid || 0));
    }
    function calculateMonthlyInterest(amount, interestRate) {
        let notRoundedInterest = ((interestRate / 100) / NUM_MONTHS_IN_YEAR) * amount;
        let roundedInterest = (Math.round(((notRoundedInterest + Number.EPSILON) * 100))) / 100; // round to two decimals
        return roundedInterest;  
    }

    // ### Start of function logic ###
    let amortTableDiv = document.getElementById(tableId);
    let amortTable = document.createElement("table");
    let totalPaid = 0;

    // clear the table so that many aren't stacked above each other
    amortTableDiv.innerHTML = "";
    amortTableDiv.style.display = "block"

    // insert the header row
    setAmortizationTableHeader(amortTable);    

    // first row after header
    createAmortTableRow(0, null, startingAmount, startingAmount, null, null, null, amortTable);

    // generate the rest of the table
    let monthCount = 1;
    while (startingAmount > 0 && monthCount < MAX_NUMBER_OF_MONTHS) {
        let interestAmount = calculateMonthlyInterest(startingAmount, interestRate);
        let monthPayment = startingAmount + interestAmount <= payment ? startingAmount + interestAmount : payment; // if starting amount < payment -> we're not going to make a full payment
        let principalPayment = monthPayment - interestAmount;
        let afterPaymentAmount = startingAmount + interestAmount - payment;
        totalPaid += monthPayment;
        
        createAmortTableRow(monthCount, monthPayment, startingAmount, afterPaymentAmount > 0 ? afterPaymentAmount : 0, interestAmount, principalPayment, totalPaid, amortTable);
        startingAmount = afterPaymentAmount;
        monthCount += 1; 
    }

    amortTableDiv.appendChild(amortTable);
}

// ##### RUN PART #####

Log.Info("Setting submission listener on the Amortization table app.");

let form = document.getElementById("submissions");

// document.getElementById("term-length").style = {display: none};

// wait to create the table until values have been submitted by user
form.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = new FormData(form);
    let dataDict = {};
    
    for (const [key, value] of data) {
        dataDict[key] = value;
    }

    // determineToCreateAmortizationTable(dataDict);
    createAmortizationTable(parseFloat(dataDict["loan-amount"]), parseFloat(dataDict["payment-amount"]), parseFloat(dataDict["interest-rate"]), "amortization-table");
});