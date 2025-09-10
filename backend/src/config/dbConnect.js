const mongoose = require('mongoose');


const dbConnect = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONECTION_STRING);
        console.log(`MongoDB connected: ${connect.connection.host}, ${connect.connection.name}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }

}

module.exports = dbConnect;