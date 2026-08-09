/*jshint esversion: 8 */
const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const cors = require("cors");
const app = express();
const port = 3050;

app.use(cors());
app.use(require("body-parser").urlencoded({ extended: false }));

const cars_data = JSON.parse(fs.readFileSync("cars_records.json", "utf8"));
const Cars = require("./cars");
mongoose.connect("mongodb://mongo_db:27017/", { dbName: "carsDB" });

try {
  Cars.deleteMany({}).then(() => {
    Cars.insertMany(cars_data.cars);
  });
} catch (error) {
  console.error("Error fetching documents:", error);
  //   res.status(500).json({ error: "Error fetching documents" });
}

// Express route to home
app.get("/", async (req, res) => {
  res.send("Welcome to the car inventory API2");
});

app.get("/cars/:id", async (req, res) => {
  try {
    const cars = await Cars.find({ dealer_id: req.params.id });
    res.json(cars);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Error fetching documents" });
  }
});

app.get("/carsbymake/:id/:make", async (req, res) => {
  try {
    const cars = await Cars.find({
      dealer_id: req.params.id,
      make: req.params.make,
    });
    res.json(cars);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Error fetching documents" });
  }
});

app.get("/carsbymodel/:id/:model", async (req, res) => {
  try {
    const cars = await Cars.find({
      dealer_id: req.params.id,
      model: req.params.model,
    });
    res.json(cars);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Error fetching documents" });
  }
});

app.get("/carsbymaxmileage/:id/:mileage", async (req, res) => {
  try {
    let mileage = parseInt(req.params.mileage);
    let condition = {};
    if (mileage === 5000) {
      condition = { $lte: mileage };
    } else if (mileage === 10000) {
      condition = { $lte: mileage, $gt: 5000 };
    } else if (mileage === 15000) {
      condition = { $lte: mileage, $gt: 10000 };
    } else if (mileage === 20000) {
      condition = { $lte: mileage, $gt: 15000 };
    } else {
      condition = { $gt: 20000 };
    }
    console.log("Fetching cars with mileage condition:", condition);
    const cars = await Cars.find({
      dealer_id: req.params.id,
      mileage: condition,
    });

    res.json(cars);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Error fetching documents" });
  }
});

app.get("/carsbyprice/:id/:price", async (req, res) => {
  try {
    let price = parseInt(req.params.price);
    let condition = {};
    if (price === 5000) {
      condition = { $lte: price };
    } else if (price === 10000) {
      condition = { $lte: price, $gt: 5000 };
    } else if (price === 15000) {
      condition = { $lte: price, $gt: 10000 };
    } else if (price === 20000) {
      condition = { $lte: price, $gt: 15000 };
    } else {
      condition = { $gt: 20000 };
    }
    const cars = await Cars.find({
      dealer_id: req.params.id,
      price: condition,
    });

    res.json(cars);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Error fetching documents" });
  }
});

app.get("/carsbyyear/:id/:year", async (req, res) => {
  try {
    let year = parseInt(req.params.year);
    const cars = await Cars.find({
      dealer_id: req.params.id,
      year: { $gte: year },
    });
    res.json(cars);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Error fetching documents" });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
