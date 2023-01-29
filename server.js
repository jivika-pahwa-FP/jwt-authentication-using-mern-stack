const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db'); // remember to import config first then call the particular func
const authRoute = require('./routes/authRoute');
const bodyParser = require('body-parser');
const cors = require('cors');
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }

const app = express();
app.use(cors(corsOptions));

const port = 5000;

app.use(bodyParser.json());
app.use('/auth',authRoute);

console.log("status : "+process.env.MONGO_URI);

connectDB();


app.listen(port, ()=>{
    console.log(`server started on Port : ${port}`);
});