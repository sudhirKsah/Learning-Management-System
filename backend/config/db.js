const mongoose = require('mongoose');

const connectDatabase = async () => {
    try{
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
    catch(error){
        console.log('MongoDB connection failed: ', error);
        process.exit(1);
    }
};

module.exports = connectDatabase;