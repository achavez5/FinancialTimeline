
// ##### RUN PART #####

/** RUN PART */

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

let timeline = Helpers.Timeline.GetTimeline(loans);

for (var i in timeline) {
    console.log(`Loan name: ${timeline[i].name}\n\t${timeline[i].stats.toString()}`);
}