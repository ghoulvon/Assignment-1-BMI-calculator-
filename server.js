const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/calculate-bmi', (req, res) => {
  let weight = parseFloat(req.body.weight);
  let height = parseFloat(req.body.height);

  if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
    return res.status(400).send(`
      <h2 style="color: red;">⚠️ Invalid input!</h2>
      <p>Weight and height must be positive numbers.</p>
      <a href="/">← Try again</a>
    `);
  }

  // Convert cm -> m
  height = height / 100;
  const bmi = (weight / (height * height)).toFixed(2);

  let category, color;
  if (bmi < 18.5) {
    category = 'Underweight';
    color = '#3498db';
  } else if (bmi < 25) {
    category = 'Normal weight';
    color = '#2ecc71'; 
  } else if (bmi < 30) {
    category = 'Overweight';
    color = '#f39c12';
  } else {
    category = 'Obese';
    color = '#e74c3c';
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BMI Result</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; text-align: center; margin-top: 50px; background: #f8f9fa; }
        .result-box {
          display: inline-block;
          padding: 30px;
          border-radius: 12px;
          background: white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          margin: 20px auto;
        }
        .bmi-value { font-size: 2.5rem; font-weight: bold; color: ${color}; }
        .category { font-size: 1.5rem; margin-top: 10px; color: ${color}; }
        .btn {
          margin-top: 20px;
          padding: 10px 20px;
          background: #3498db;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          display: inline-block;
        }
        .btn:hover { background: #2980b9; }
      </style>
    </head>
    <body>
      <div class="result-box">
        <h1>Your BMI Result</h1>
        <div class="bmi-value">${bmi}</div>
        <div class="category">${category}</div>
        <p><em>(Weight: ${req.body.weight} kg, Height: ${req.body.height} cm)</em></p>
        <a href="/" class="btn">🔄 Calculate Again</a>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});