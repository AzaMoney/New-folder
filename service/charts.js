const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');


// Function to generate pie chart
async function generatePieChart(mf, pw, pc) {
    const width = 350; // Width of the chart
    const height = 300; // Height of the chart

    // Create a new instance of ChartJSNodeCanvas
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

    // Define chart data
    const data = {
        labels: [`Mentorship offered: ${mf}`, `Projects worked on: ${pw}`, `Projects created: ${pc}`],
        datasets: [{
            label: 'My First Dataset',
            data: [mf, pw, pc],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)'],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
        }]
    };

    // Define chart options
    const options = {
        // Remove scales for pie chart
    };

    // Create the pie chart configuration
    const configuration = {
        type: 'pie', // Change the chart type to pie
        data: data,
        options: options
    };

    console.log('Pie Chart configuration:', configuration);

    try {
        // Generate the pie chart image
        const image = await chartJSNodeCanvas.renderToBuffer(configuration);

        // Convert the image buffer to a base64-encoded Data URL
        const dataUrl = `data:image/png;base64,${image.toString('base64')}`;

        return dataUrl;
    } catch (error) {
        console.error('Error generating pie chart image:', error);
    }
}

// Call the function to generate the pie chart
module.exports = {
    generatePieChart
};