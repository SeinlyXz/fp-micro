const express = require('express');
const mariadb = require('mariadb');
const app = express();

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'mikrodb',
    connectionLimit: 5
});
app.use(express.json())

const mongoose = require("mongoose");

let uri = "mongodb://localhost:27017/test"
console.log("Connecting to DB...");
console.log("   ", uri);


if (!uri) {
  throw Error("Please set MONGODB_URI env variable");
}

mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  retryWrites: false,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function callback() {
  console.log("MongoDB Connected.");
});


app.get("/testGet", async (req, res) => {
    try {
        const rows = await db.collection("message").find({}).toArray();
        res.json({ success: true, users: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

app.post("/test", async (req, res) => {
    const { fingerprint } = req.body;
    try {
        await db.collection("message").insertOne({ fingerprint });
        res.json({ success: true, message: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

app.post('/api/register', async (req, res) => {
    const { finger_id, day, time_stamp } = req.body;
    try {   
        const conn = await pool.getConnection();
        console.log('Connected to the database');
        await conn.query("INSERT INTO db (finger_id, day, time_stamp) VALUES (?, ?, ?)", [finger_id, day, time_stamp]);
        conn.release();
        res.json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        console.log('Connected to the database');
        const rows = await conn.query("SELECT * FROM db");
        conn.release();
        res.json({ success: true, users: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
