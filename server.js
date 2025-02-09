// Budget API
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const express = require('express');
const app = express();
const port = 3000;

app.use(cors());

app.use('/', express.static('public'));

app.get('/hello', (req, res) => {
    res.send('Hello World!')
});

app.get('/budget', (req, res) => {
    const filePath = path.join(__dirname, 'budget-data.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.log("Error reading budget-data.json");
        }
        const myBudget = JSON.parse(data);
        res.json(myBudget);
});
});

app.listen(port, () => {
    console.log('Example app listening at http://localhost:3000')
});