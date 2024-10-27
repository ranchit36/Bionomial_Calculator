// script.js

async function generatePascalTriangle(n, k) {
    const triangleDiv = document.getElementById('triangle');
    triangleDiv.innerHTML = ''; // Clear previous visualization

    const triangle = [];
    for (let i = 0; i <= n; i++) {
        triangle[i] = new Array(k + 1).fill(0);  // Set the array size to k+1
        for (let j = 0; j <= Math.min(i, k); j++) {  // Only iterate up to k
            if (j === 0 || j === i) {
                triangle[i][j] = 1;
            } else {
                triangle[i][j] = triangle[i - 1][j - 1] + triangle[i - 1][j];
            }
            await visualizeStep(triangle, i, j);
        }
    }
    return triangle;
}

async function visualizeStep(triangle, row, col) {
    const triangleDiv = document.getElementById('triangle');
    const speed = parseInt(document.getElementById('speedSelect').value);
    visualizePascalTriangle(triangle, triangleDiv);
    await new Promise(resolve => setTimeout(resolve, speed));
}

function visualizePascalTriangle(triangle, triangleDiv) {
    const k = parseInt(document.getElementById('kInput').value);
    triangleDiv.innerHTML = '';
    for (let i = 0; i < triangle.length; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';
        for (let j = 0; j <= k; j++) {  // Restrict to k+1 columns
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
            cellDiv.innerHTML = triangle[i][j] !== 0 ? triangle[i][j] : '';
            rowDiv.appendChild(cellDiv);
        }
        triangleDiv.appendChild(rowDiv);
    }
}

function clearVisualization() {
    const triangleDiv = document.getElementById('triangle');
    const formulaDiv = document.getElementById('formula');
    const timeComplexityDiv = document.getElementById('time-complexity');
    const finalResultDiv = document.getElementById('final-result');
    const dynamicProgrammingDiv = document.getElementById('dynamic-programming');

    triangleDiv.innerHTML = '';
    formulaDiv.innerHTML = '';
    timeComplexityDiv.innerHTML = '';
    finalResultDiv.innerHTML = '';
    dynamicProgrammingDiv.innerHTML = '';
}

function displayFinalResult(triangle, n, k) {
    const finalResultDiv = document.getElementById('final-result');
    const result = triangle[n][k];
    finalResultDiv.innerHTML = `Binomial Coefficient (${n} choose ${k}): ${result}`;
}

async function generateAndVisualize() {
    clearVisualization();

    const n = parseInt(document.getElementById('nInput').value);
    const k = parseInt(document.getElementById('kInput').value);
    const method = document.querySelector('input[name="method"]:checked').value;

    if (n >= 0 && k >= 0 && k <= n) {
        let result;
        const startTime = performance.now();

        if (method === 'dynamic') {
            const triangle = await generatePascalTriangle(n, k);
            result = triangle[n][k];
            displayDynamicProgrammingInfo();
            displayTimeComplexity('O(n*k)');
        } else {
            result = binomialCoefficientFormula(n, k);
            displayFormulaInfo();
            displayTimeComplexity('O(n)');
        }

        const endTime = performance.now();
        const duration = endTime - startTime;

        displayFinalResult({ [n]: { [k]: result } }, n, k);
        updateTimeComplexityGraph(method, n, duration);
    } else {
        alert('Please enter valid values for n and k (0 <= k <= n).');
    }
}

function binomialCoefficientFormula(n, k) {
    if (k > n - k) k = n - k;
    let result = 1;
    for (let i = 0; i < k; i++) {
        result *= (n - i);
        result /= (i + 1);
    }
    return result;
}

function displayFormulaInfo() {
    const dynamicProgrammingDiv = document.getElementById('dynamic-programming');
    dynamicProgrammingDiv.innerHTML = 'Direct Formula method was used to calculate the binomial coefficient.';
}

function displayDynamicProgrammingInfo() {
    const dynamicProgrammingDiv = document.getElementById('dynamic-programming');
    dynamicProgrammingDiv.innerHTML = 'Dynamic Programming was used to calculate the binomial coefficient using Pascal\'s Triangle.';
}

function displayTimeComplexity(complexity) {
    const timeComplexityDiv = document.getElementById('time-complexity');
    timeComplexityDiv.innerHTML = `Time Complexity: ${complexity}`;
}

function updateTimeComplexityGraph(method, n, duration) {
    const chartElement = document.getElementById('timeComplexityChart');
    const chart = Chart.getChart(chartElement);

    if (!chart) {
        new Chart(chartElement, {
            type: 'line',
            data: {
                labels: [n],
                datasets: [
                    {
                        label: 'Dynamic Programming (O(n*k))',
                        data: method === 'dynamic' ? [duration] : [],
                        borderColor: 'blue',
                        fill: false,
                    },
                    {
                        label: 'Direct Formula (O(n))',
                        data: method === 'formula' ? [duration] : [],
                        borderColor: 'red',
                        fill: false,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'n',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Time (ms)',
                        },
                    },
                },
            },
        });
    } else {
        const dynamicDataset = chart.data.datasets.find(dataset => dataset.label === 'Dynamic Programming (O(n*k))');
        const formulaDataset = chart.data.datasets.find(dataset => dataset.label === 'Direct Formula (O(n))');

        if (method === 'dynamic') {
            dynamicDataset.data.push(duration);
        } else {
            formulaDataset.data.push(duration);
        }

        chart.data.labels.push(n);
        chart.update();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    generateAndVisualize();
});
