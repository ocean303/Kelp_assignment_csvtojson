# 📊 CSV to JSON API Converter (with PostgreSQL)

This project is a **Node.js + Express API** that converts CSV data into JSON format when a **POST** request is made to an endpoint.  
Once converted, the data is stored in a **PostgreSQL** database.  
After insertion, the application calculates the **age distribution** of all users and prints a summary report to the console.

---

## 🚀 Features

✅ Converts CSV file content into structured JSON  
✅ Inserts user records into a PostgreSQL database  
✅ Automatically separates **mandatory fields** (name, age, address)  
✅ Stores all remaining attributes inside `additionalinfo` as a JSON object  
✅ Calculates and displays **age group distribution** after upload  
✅ Simple API endpoint that can be triggered via **cURL** or **Postman**  
✅ Uses **dotenv** for environment configuration  

---

## ⚙️ Setup Instructions

1️⃣ Clone the repository

```bash
git clone https://github.com/ocean303/Kelp_assignment_csvtojson.git
cd Kelp_assignment_csvtojson
```

2️⃣ Clone the repository
```bash
npm install
```

3️⃣ Create and configure .env

Create a file named .env in the root directory and add your database configuration:
```.env
PORT=3000
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database_name>
CSV_FILE_PATH=./first.csv
```



🧩 Database Setup

Execute the following SQL command to create the users table in your database:
```sql
CREATE TABLE public.users (
  name JSONB NOT NULL,
  age INT NOT NULL,
  address JSONB,
  additionalinfo JSONB,
  id SERIAL PRIMARY KEY
);
```
You can run this in psql, PgAdmin, or any SQL client.



🧠 API Endpoint
POST /upload

Reads and converts CSV data to JSON, inserts all records into the database, and returns an age distribution summary.
Send a POST request to the endpoint using curl or Postman
```bash
curl -X POST http://localhost:3000/upload
```



🧰 Technologies Used

Node.js – Server-side JavaScript runtime

Express.js – Web application framework

PostgreSQL – Relational database

dotenv – Environment variable management

fs (Node module) – File system access
