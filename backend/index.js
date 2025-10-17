// Packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Import cors
import cookieParser from "cookie-parser";

// Utils
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js"; 
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import dialogflowRoutes from './routes/dialogflowRoutes.js';


dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
})); // Use cors middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
  

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use('/api/chatbot', dialogflowRoutes);

app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID});
});

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

app.listen(port, () => console.log(`Server is running on port: ${port}`));
