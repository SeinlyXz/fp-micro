const express = require('express');
const app = express();
const port = 3000;
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


app.get('/testGet', async (req, res) => {
  // Your logic for handling the GET request goes here
  try {
    const rows = await db.collection("message").find({}).toArray();

    // Check if it's empty
    if (rows.length === 0) {
      return res.json({ success: true, message: 'No users found' });
    }

    res.json({ success: true, users: rows });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'An error occurred' });
  }
});

app.post('/testPost', async (req, res) => {
  // Your logic for handling the POST request goes here
  try {
    const { fingerprint_id } = req.body;
    console.log(fingerprint_id)
    const result = await db.collection("message").insertOne({ fingerprint_id });
    res.json({ success: true, message: result });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'An error occurred' });
  }
})

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

