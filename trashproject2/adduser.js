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

    let { id, fullname, email, img } = req.body;

    if (!id || !fullname || !email){
        return res.status(400).json({error : "not found..."});
    }

    fullname = fullname.trim();
    email = email.trim();
    if (img) img = img.trim();

    if (fullname.length === 0 || email.length === 0) {
        return res.status(400).json({error: "Fields cannot be empty"});
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

        const doesExist = await users.findOne({$or: [{id: id}, {email: email}]}).maxTimeMS(5000);

        if (doesExist){
            return res.status(409).json({message: "already exist ... urmon"});
        }

        const userDoc = { id, fullname, email };
        if (img && img.length > 0) {
            userDoc.img = img;
        }

        await users.insertOne(userDoc);
        console.log(`User added: id=${id}, email=${email}`);
        res.status(201).json({message:"added succc"});

    }catch(err){
        console.error(err);
        res.status(500).json({error : "ur mom"});
    }
});

app.listen(PORT, async ()=>{
    if (!uri || uri.trim() === "") {
        console.log("MongoDB URI is empty. Set MONGODB_URI environment variable.");
        process.exit(1);
    }

    try{
        await client.connect();
        
        const db = client.db('mydb');
        const users = db.collection('USERS');
        
        await users.createIndex({id: 1}, {unique: true}).catch(() => {});
        await users.createIndex({email: 1}, {unique: true}).catch(() => {});
        
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
