const NUM_MONTHS_IN_YEAR = Helpers.Math.NumMonthsInYear;
const AMORTIZATION_TABLE_HEADERS = ["MONTH", "PAYMENT", "STARTING AMOUNT", "ENDING AMOUNT", "INTEREST PAID", "PRINCIPAL PAID", "TOTAL PAID"];
const MAX_NUMBER_OF_MONTHS = Helpers.Math.MaxNumberOfMonthsInTable;

// Calculates and returns an array of elements representing months until the loan is paid 
function createAmortizationTable(startingAmount, payment, interestRate, tableId) {
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
    function createAmortTableRow(month, rowPayment, rowStartingAmount, rowEndingAmount, rowInterestPaid, rowPrincipalPaid, totalPaid) { 
        function createRowData(value) {
            let newTableData = document.createElement("td");
            newTableData.innerText = value;
            return newTableData;
        }
        
        let newRow = document.createElement("tr");
        const formatter = Helpers.Common.FormatToDollar;

        newRow.appendChild(createRowData(month && month > 0 ? month : "LOAN START")); 
        newRow.appendChild(createRowData(formatter.format(rowPayment || 0)));
        newRow.appendChild(createRowData(formatter.format(rowStartingAmount || 0))); 
        newRow.appendChild(createRowData(formatter.format(rowEndingAmount || 0)));
        newRow.appendChild(createRowData(formatter.format(rowInterestPaid || 0)));
        newRow.appendChild(createRowData(formatter.format(rowPrincipalPaid || 0)));
        newRow.appendChild(createRowData(formatter.format(totalPaid || 0)));
    
        return newRow;
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
    amortTableDiv.style.display = "block";

    // insert the header row
    amortTable.appendChild(getAmortizationTableHeader());    

    // first row after header
    amortTable.appendChild(createAmortTableRow(null, null, startingAmount, startingAmount, null, null, null));

    // generate the rest of the table
    let monthCount = 1;
    while (startingAmount > 0 && monthCount < MAX_NUMBER_OF_MONTHS) {
        let interestAmount = calculateMonthlyInterest(startingAmount, interestRate);
        let monthPayment = startingAmount + interestAmount <= payment ? startingAmount + interestAmount : payment; // if starting amount < payment -> we're not going to make a full payment
        let principalPayment = monthPayment - interestAmount;
        let afterPaymentAmount = startingAmount + interestAmount - payment;
        totalPaid += monthPayment;
        
        let row = createAmortTableRow(monthCount, monthPayment, startingAmount, afterPaymentAmount > 0 ? afterPaymentAmount : 0, interestAmount, principalPayment, totalPaid);
        amortTable.appendChild(row);

        startingAmount = afterPaymentAmount;
        monthCount += 1; 
    }

    amortTableDiv.appendChild(amortTable);

    return true;
}

// ##### RUN PART #####

Log.Info("Setting submission listener on the Amortization table app.");

let form = document.getElementById("submissions");

// wait to create the table until values have been submitted by user
form.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = new FormData(form);
    let dataDict = {};
    
    for (const [key, value] of data) {
        dataDict[key] = value;
    }

    createAmortizationTable(parseFloat(dataDict["loan-amount"]), parseFloat(dataDict["payment-amount"]), parseFloat(dataDict["interest-rate"]), "amortization-table");
});