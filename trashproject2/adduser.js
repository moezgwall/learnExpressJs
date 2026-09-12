const express = require('express');
const { MongoClient} = require('mongodb');

const app = express();
const PORT = 3000;

app.use(express.json());

const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);

app.post('/adding-user', async (req,res)=>{

    const { id,fullname,email,img} = req.body;

    if (!id || !fullname || !email){
        return res.status(400).json({error : "not found..."});

    }
    try{    
        const db = client.db('mydb');
        const users = db.collection('USERS');

        const doesExist = await users.findOne({id:id});

        if (doesExist){
            return res.status(409).json({message: "already exist ... urmon"});

        }
        await users.insertOne({ id,fullname,email,img} );
        res.status(201).json({message:"added succc"});

    }catch(err){
        console.error(err);
        res.status(500).json({error : "ur mom"});
    }
});

app.listen(PORT, async ()=>{
    try{
        await client.connect();
        console.log(`Server is running at http://localhost:${PORT}`);
    }catch(err){
        console.log("failed to connect to db", err);
    }
});
