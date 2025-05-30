require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("./data/database");

const app = express();
const port = process.env.PORT || 3000;

// ✅ Apply body-parser before CORS middleware
app.use(bodyParser.json());

// ✅ Improved CORS configuration
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Z-key"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

app.use("/", require("./routes"));

// ✅ Improved error handling for MongoDB connection
mongodb.initDb((err) => {
    if (err) {
        console.error("Database connection error!", err);
        process.exit(1); // Stop server if DB connection fails
    } else {
        app.listen(port, () => {
            console.log(`Database is listening and node running on port ${port}`);
        });
    }
});

// ✅ Global error handler for better debugging
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});