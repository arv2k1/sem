function myFunction() {
    console.log('JS started');
    setInterval(updateParams, 5 * 1000);
}

function updateParams() {
    console.log('Fetching the data');
    var req = new XMLHttpRequest();

    req.open("GET", "https://sheets.googleapis.com/v4/spreadsheets/1FAJIonMEJuFqgoAJkBlD7iUobrcCxxZjVH3vte7-I48/values/B2%3AB7?key=AIzaSyCNNTlGLjbAVl1rWmP_hfw8xEA2YWTf7zw");
    req.send();

    req.onreadystatechange = function () {
        if (this.readyState == 4) {
            var obj = JSON.parse(this.responseText);
            console.log(obj.values);
            writeValues(obj.values);
        }
    };
}

function writeValues(arr) {
    document.getElementById('v').innerHTML = arr[0][0] + ' V';
    document.getElementById('c').innerHTML = arr[1][0] + ' A';
    document.getElementById('f').innerHTML = arr[2][0] + ' Hz';
    document.getElementById('pf').innerHTML = arr[3][0];
    document.getElementById('p').innerHTML = arr[4][0] + ' W';
    document.getElementById('e').innerHTML = arr[5][0] + ' kWh';
    document.getElementById('b').innerHTML = 'Rs.' + calculateBill(arr[5][0]);
    console.log('Updated\n\n');
}

function calculateBill(energy) {
    // TNEB Tariff rates for domestic consumer
    // Source : https://www.tangedco.gov.in/linkpdf/ONE_PAGE_STATEMENT.pdf
    // 0 to 100   : Rs.0 per unit
    // 101 to 200 : Rs.3.50 per unit
    // 201 to 500 : Rs.4.60 per unit
    // above 500  : Rs.6.60 per unit

    if (energy <= 100)
        return 0;

    if (energy <= 200)
        return (energy - 100) * 3.50;

    if (energy <= 500)
        return (0 + 100 * 3.50 + (energy - 200) * 4.60);

    return (0 + 100 * 3.50 + 300 * 4.60 + (energy - 500) * 6.60);
}
