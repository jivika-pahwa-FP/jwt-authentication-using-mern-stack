const mongoose = require('mongoose');
const URL = require('./utils/env'); // another way to use env-variables

// connect to DB

const mongo_url = URL.MONGO_URI;
console.log(` config uRL : ${mongo_url} `);


const connectDB = async () => {

    try{
        console.log("inside func");
        const connection = await mongoose.connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true })
        if(connection){
            console.log("Server up and running!")
        }
        else{
            console.log("Server not running!")
        }
    }
    catch(error){
        console.log(error)
    }
    
}
module.exports = connectDB;