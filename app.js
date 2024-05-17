const express = require("express");
const mongoose = require("mongoose");
const authReouter = require("./routes/auth");
const cors = require('cors');

const PORT = 2030;

const DBC = "mongodb+srv://jcpofficialjo:mg9kxsNz64P1RlH4@cluster0.ugf8uor.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const app = express();

const corsOptions = {
  origin: 'https://batayneh-store.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add the allowed methods
  allowedHeaders: ['Content-Type', 'Authorization', 'access-control-allow-methods'], // Include 'access-control-allow-methods'
};

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// روت لمعالجة الطلبات الدخولية
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.sendStatus(200);
});

app.use(cors(corsOptions));

app.use(express.json());

app.use(authReouter);

mongoose.connect(DBC).then(() => {
    console.log("Connected to MongoDB! :)");
}).catch((err) => {
    console.error(`Could not connect to MongoDB: ${err}`);
});

app.listen(PORT, "62.72.35.90", () => {
    console.log(`hi im working port ${PORT}`);
});
