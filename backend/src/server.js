const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./config/dbConnect");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const cors = require("cors");


dotenv.config();

dbConnect();

const app = express();

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true                
}));

//PORT
const PORT = process.env.PORT || 5000;

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/transaction", transactionRoutes);


//Start server
app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});