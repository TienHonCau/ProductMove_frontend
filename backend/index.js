const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const route = require("./routes");
const app = express();
const port = 8000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

route(app);

// Connect database
try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");
} catch (err) {
    console.log(err);
}

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
