require('dotenv').config();
const express = require('express');
const fs = require('fs');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function extractFields(userObj) {
  const name = {
    firstName: userObj.name?.firstName,
    lastName: userObj.name?.lastName
  };
  const age = parseInt(userObj.age);
  const address = userObj.address || {};
  // Remove mandatory fields from additionalinfo
  const additionalinfo = { ...userObj };
  delete additionalinfo.name;
  delete additionalinfo.age;
  delete additionalinfo.address;
  return { name, age, address, additionalinfo };
}

async function insertUser(user) {
  const { name, age, address, additionalinfo } = extractFields(user);
  await pool.query(
    'INSERT INTO users (name, age, address, additionalinfo) VALUES ($1, $2, $3, $4)',
    [name, age, address, additionalinfo]
  );
}

async function getAgeDistribution() {
  const res = await pool.query('SELECT age FROM users');
  const ages = res.rows.map(r => r.age);
  const summary = { '0-20': 0, '20-40': 0, '40-60': 0, '60+': 0 };
  ages.forEach(age => {
    if (age < 20) summary['0-20']++;
    else if (age < 40) summary['20-40']++;
    else if (age < 60) summary['40-60']++;
    else summary['60+']++;
  });
  return summary;
}

app.post('/upload', async (req, res) => {
  // Read and parse the CSV using your logic
  const csvFile = fs.readFileSync(process.env.CSV_FILE_PATH);
  const arr = csvFile.toString().trim().split('\n');

  const headers = arr[0].split(',');
  const obj = [];

  for (let i = 1; i < arr.length; i++) {
    const data = arr[i].split(',');
    const headerobj = {};

    for (let j = 0; j < data.length; j++) {
      const keys = headers[j].trim().split('.');
      let current = headerobj;
      for (let k = 0; k < keys.length - 1; k++) {
        if (!current[keys[k]]) {
          current[keys[k]] = {};
        }
        current = current[keys[k]];
      }
      current[keys[keys.length - 1]] = data[j].trim();
    }

    obj.push(headerobj);
  }

  // Insert users into PostgreSQL
  for (const user of obj) {
    await insertUser(user);
  }

  // Produce age group report
  const report = await getAgeDistribution();

  // Respond with outcome and report
  res.json({ uploaded: obj.length, ageGroupReport: report, users:obj });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
