require('dotenv').config(); // .env

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/route');
const errno = require('./errnoMiddleware/errno'); 
const cors = require('cors');
const PORT = 3000;
const app = express();


app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

// CONNECT TO OUR MONGODB
mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("MongoDB connected ...");}
).catch( (err)=>{
    console.log("failed to connect to the MongoDB ...");
    process.exit(1);
});
app.get('/', (req,res)=>{
    res.send("API IS RUNNING ON SERVER 3000"); 
});
// a simple get test 
app.use('/',userRouter);
app.use(errno);
// missing app.use ( users, error-middleware);
app.listen(PORT, ()=>{console.log(`Server : http://localhost:${PORT}`);});
