// Packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Import cors
import cookieParser from "cookie-parser";

// Utils
import connectDB from "./config/db.js";

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(cors()); // Use cors middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
  

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => console.log(`Server is running on port: ${port}`));
