const express = require("express");
const mongoose = require("mongoose");
const authReouter = require("./routes/auth");

const PORT = 2030;

const DBC = "mongodb+srv://jcpofficialjo:mg9kxsNz64P1RlH4@cluster0.ugf8uor.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const app = express();

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
