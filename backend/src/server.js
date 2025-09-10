const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());

//PORT
const PORT = process.env.PORT || 5000;


//Start server
app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});