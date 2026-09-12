const express = require('express');
const { MongoClient} = require('mongodb');

const app = express();
const PORT = 3000;

app.use(express.json());

const uri = process.env.MONGODB_URI || "";
let client = new MongoClient(uri);
let isConnected = false;

app.post('/adding-user', async (req,res)=>{

    if (!isConnected) {
        return res.status(503).json({error: "Database not connected"});
    }

    const { id, fullname, email, img } = req.body;

    if (!id || !fullname || !email){
        return res.status(400).json({error : "not found..."});
    }

    if (typeof id !== 'number' || typeof fullname !== 'string' || typeof email !== 'string') {
        return res.status(400).json({error: "Invalid data types"});
    }

    if (img && typeof img !== 'string') {
        return res.status(400).json({error: "Invalid img type"});
    }

    try{    
        const db = client.db('mydb');
        const users = db.collection('USERS');

        const doesExist = await users.findOne({$or: [{id: id}, {email: email}]});

        if (doesExist){
            return res.status(409).json({message: "already exist ... urmon"});
        }

        await users.insertOne({ id, fullname, email, img: img || null});
        res.status(201).json({message:"added succc"});

    }catch(err){
        console.error(err);
        res.status(500).json({error : "ur mom"});
    }
});

app.listen(PORT, async ()=>{
    try{
        await client.connect();
        isConnected = true;
        console.log(`Server is running at http://localhost:${PORT}`);
    }catch(err){
        console.log("failed to connect to db", err);
        process.exit(1);
    }
});

process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    if (isConnected) {
        await client.close();
    }
    process.exit(0);
});
