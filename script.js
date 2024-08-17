async function fetchIntradayStockData(symbol, apiKey, interval='1min') {
    const functionType = 'TIME_SERIES_INTRADAY';
    const url = `https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&interval=${interval}&apikey=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data["Error Message"]) {
            console.log(`Error fetching data for symbol: ${symbol}`);
            return null;
        }

        const metaData = data['Meta Data'];
        const timeSeriesKey = `Time Series (${interval})`;
        const timeSeries = data[timeSeriesKey];

        const df = Object.keys(timeSeries).map(key => {
            return {
                date: key,
                open: parseFloat(timeSeries[key]['1. open']),
                high: parseFloat(timeSeries[key]['2. high']),
                low: parseFloat(timeSeries[key]['3. low']),
                close: parseFloat(timeSeries[key]['4. close']),
                volume: parseInt(timeSeries[key]['5. volume'])
            };
        });

        return { metaData, df };
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

function displayIntradayStockData(metaData, df) {
    const container = document.querySelector('.stock-data');
    container.innerHTML = `
        <h2>Alpha Vantage real-time stock price data</h2>
        <h3>${metaData['1. Information']}</h3>
        <h4>Symbol: ${metaData['2. Symbol']}</h4>
        <h4>Last update: ${metaData['3. Last Refreshed']}</h4>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Open</th>
                    <th>High</th>
                    <th>Low</th>
                    <th>Close</th>
                    <th>Volume</th>
                </tr>
            </thead>
            <tbody>
                ${df.map(row => `
                    <tr>
                        <td>${row.date}</td>
                        <td>${row.open}</td>
                        <td>${row.high}</td>
                        <td>${row.low}</td>
                        <td>${row.close}</td>
                        <td>${row.volume}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

const symbol = 'AAPL'; // Replace with desired stock symbol
const interval = '1min'; // Replace with desired interval
const apiKey = 'N2IYZ7RIV0FYGK56'; // Replace with your Alpha Vantage API key

fetchIntradayStockData(symbol, apiKey, interval).then(data => {
    if (data) {
        displayIntradayStockData(data.metaData, data.df);
    }
});
