const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const port = 3000;

// is there is no params at the route (url) you use body instead of params
// you use params only when the url contains paramas i.e '/users/names/:name' -> name is a param
// avoid routes conflict 
// CURL -X GET http://localhost:3000/users/names/alex" 
// CURL -X POST http://localhost:3000/users -H "Content-type:application/json" -d "{\"name\": \"zozin\" , \"cin\":\"00011100\"}"


app.use(express.static("public")); // serve HTML form from /public
app.use(express.json());

USERS = [];
// create a user
// so here the url doesn't contain any params 
// name & cin : so we used body
app.post('/users' ,(req,res)=>{
    const userName = req.body.name;
    const cinNumber = req.body.cin;
    if (!userName || !cinNumber){
        res.status(400).send("failed to add a user");
    }
    const  user = {'name': userName , 'cin': cinNumber};
    USERS.push(user);
    res.status(201).send({message : "user added successfuly "});
});
app.get('/users/cins/:cin/htmlelem' , (req,res)=>{
    const cin = req.params.cin;
    if (!cin){
        return res.status(400).send("failed to get user...");
    }
    const user = USERS.find((user) => user.cin === cin);
    if (!user){
        return res.status(400).send("failed to get user...");
    }
    //res.status(201).json({name : user.name});
    res.send(`
           <h3>USER INFO</h3>
           <p>user-name:${user.name}</p>
            <p>user-cin:${user.cin}</p>
        
        `);
    
});
app.get('/users/names/:name' , (req,res)=>{
    const name = req.params.name;
    if (!name){
        return res.status(400).send("failed to get user...");
    }
    const user = USERS.find((user) => user.name.toLowerCase() === name.toLowerCase());
    if (!user){
        return res.status(404).send("failed to get user...");
    }
    res.status(200).send(user.cin);});
app.get('/' , (req,res)=>{
    res.send("hello world");
});
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req,file,cb) => {
        cb(null,Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({storage});
const POSTS = [];

app.post('/posts' , upload.single('image'), (req,res)=>{
    const text = req.body.text;
    const img = req.file;
    if (!text || !img){
        return res.status(400).send("missing text or file");
    }
    const post = {
        id : POSTS.length + 1,
        text,
        imgURL : `/uploads/${img.filename}`,
        createAt : new Date(),};
    POSTS.push(post);
    res.status(201).json({ message : "post created" , post});
});
app.get('/posts/:id/show' , (req,res)=>{
    const postID = Number(req.params.id);
    const post = POSTS.find((p) => p.id === postID);
    if (!post){
        return res.status(400).send("failed to get post");
    }

res.status(200).send(`
    <h1> post information </h1>
    <p> "id": [${post.id}] ,"content": ${post.text}</p>
    <img src=${post.imgURL}></img>
    <p> "date":${post.createAt} </p>`);
});
app.use("/uploads" , express.static("uploads"));
app.listen(port,()=>{
    console.log(`server is running at http://localhost:${port}`)
});













