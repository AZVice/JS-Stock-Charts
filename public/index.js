function getColor(stock){//This function takes the stock name and attaches a color.
    if(stock === "GME"){
        return 'rgba(61, 161, 61, 0.7)'
    }
    if(stock === "MSFT"){
        return 'rgba(209, 4, 25, 0.7)'
    }
    if(stock === "DIS"){
        return 'rgba(18, 4, 209, 0.7)'
    }
    if(stock === "BNTX"){
        return 'rgba(166, 43, 158, 0.7)'
    }
}

async function main() {  //Entry point to our code.
    const timeChartCanvas = document.querySelector('#time-chart'); //Select canvas emelemts by IDs and are stored in variables for later use. 
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');

    const response = await fetch(`https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1day&apikey=1f058d6856784072ad59704e30210d40`) //await is added to wait for a server response. Key from Twelve Data.

    const result = await response.json()//JSON data is parsed to a variable.

    const { GME, MSFT, DIS, BNTX } = result; //Object to obtain idividual data objects for stock names.

    const stocks = [GME, MSFT, DIS, BNTX]; //an array is crated named stocks, to hold data obtained by API responses. 

    stocks.forEach( stock => stock.values.reverse()) //reverse function is called to make sure the data is displayed in a chronological order on charts.

    // Time Chart
    new Chart(timeChartCanvas.getContext('2d'), {//Display stock prices over a period of time. 
        type: 'line',
        data: {
            labels: stocks[0].values.map(value => value.datetime), //The x-Axis labels taken from datetime property of the first stock values and representing dates. 
            datasets: stocks.map(stock => ({ // A dataset is created with all decorative properties. 
                label: stock.meta.symbol,
                backgroundColor: getColor(stock.meta.symbol),
                borderColor: getColor(stock.meta.symbol),
                data: stock.values.map(value => parseFloat(value.high))
            }))
        }
    });

    // High Chart
    new Chart(highestPriceChartCanvas.getContext('2d'), { //Display the highest stock price of each stock. 
        type: 'bar',
        data: {
            labels: stocks.map(stock => stock.meta.symbol), //The x-axis lables are stock symbols. 
            datasets: [{
                label: 'Highest',
                backgroundColor: stocks.map(stock => ( //Background and border color are generated by getColor().
                    getColor(stock.meta.symbol)
                )),
                borderColor: stocks.map(stock => (  //Background and border color are generated by getColor().
                    getColor(stock.meta.symbol)
                )),
                data: stocks.map(stock => (  //High prices over a period of time. 
                    findHighest(stock.values)
                ))
            }]
        }
    });

    // Average Chart
    new Chart(averagePriceChartCanvas.getContext('2d'), { // Display average stock prices inside a pie chart. 
        type: 'pie',
        data: {
            labels: stocks.map(stock => stock.meta.symbol), // Stock symbols. 
            datasets: [{
                label: 'Average',
                backgroundColor: stocks.map(stock => ( //Background and border color are generated by getColor().
                    getColor(stock.meta.symbol)
                )),
                borderColor: stocks.map(stock => (  //Background and border color are generated by getColor().
                    getColor(stock.meta.symbol)
                )),
                data: stocks.map(stock => (
                    calculateAverage(stock.values)  //calculate average function 
                ))
            }]
        }
    });
}

function findHighest(values) {  //takes an array of stock data as an argument
    let highest = 0;
    values.forEach(value => { //iterates through values and finds the max number from zero. 
        if (parseFloat(value.high) > highest) {  //Checks for a value against a another value to select the max value available. 
            highest = value.high
        }
    })
    return highest //returns higher value found. 
}

function calculateAverage(values) { //An array of values is taken and uses values as an argument.
    let total = 0;          // total is initialized. 
    values.forEach(value => {  //iterates through values and adds each value to the total. 
        total += parseFloat(value.high)
    })
    return total / values.length // record the total and devides by the number of results. This calculation will yield an average. 
}

main() //When main is called. Data pull is initiated, chart creating and rendering. 