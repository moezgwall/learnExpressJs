require('dotenv').config();

const express= require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/user');
const errorHandler = require('./middleware/errorHandling');

const app = express();
app.use(express.json());


const PORT = process.env.PORT || 3000;


mongoose.connect(process.env.MONGODB_URI).then( ()=>{
    console.log('MongoDB connected');
}).catch((err)=>{
    console.log("failed to connect to DB",err);
    process.exit(1);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// routes
app.use('/api/users',usersRouter);

app.get('/', (req,res)=>{
    res.send('API IS RUNNING');
});
app.use(errorHandler);

app.listen(PORT, ()=>{
      console.log(`Server running on port ${PORT}`);


});
