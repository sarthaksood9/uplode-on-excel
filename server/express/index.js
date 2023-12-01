
// import express from "express";

// import path from "path";

// import mongoose from "mongoose";
// import { name } from "ejs";


// mongoose.connect('mongodb+srv://sarthaksood09:VKP2eUnfR0HN2lzL@cluster0.sjhk127.mongodb.net/?retryWrites=true&w=majority', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// const messageCollection=new mongoose.Schema({
//     name:String ,
//     email:String
// })

// const msg=mongoose.model("message",messageCollection);



// // VKP2eUnfR0HN2lzL




// const app = express() ;

// app.set("view engine","ejs");


// app.get("/home",(req,res)=>{
//     msg.create({name:"Sarthak2",email:"sarthaksood020@gmail.com"}).then(()=>{
//         console.log("message Sent to Database");
//         res.send("Home page");  
//     }).catch((e)=>{
//         console.log(e);
//     })
// })

// app.get("/json",(req,res)=>{
//     res.json({
//         sucess:"true",
//         products:[],
//     })
// })
// app.get("/new",(req,res)=>{
//     res.render("indexs",{name:"sood"})
// })




// app.get("/",(req,res)=>{
//     res.render("login")
// })

// app.post("/login",(req,res)=>{
//     res.cookie("token","iamin",);
//     res.redirect("/");
// })

// app.get("/read",(req,res)=>{
//     const pathlocation =path.resolve();
//     res.sendFile(path.join(pathlocation,"./index.html"));
// })


// app.listen(4000,()=>{
//     console.log("server is created");
// })




const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = 3000;

// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// MongoDB connection URI and database name
const mongoURI = 'mongodb+srv://sarthaksood09:VKP2eUnfR0HN2lzL@cluster0.sjhk127.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'your_database_name';
const collectionName = 'your_collection_name';

// MongoDB connection
async function connectToMongoDB() {
  const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client.db(dbName).collection(collectionName);
}

// Route to handle file upload and MongoDB insertion
app.post('/upload', upload.single('excelFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileBuffer = req.file.buffer;
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });

    // Assuming the first sheet is the target sheet
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const collection = await connectToMongoDB();
    await collection.insertMany(sheetData);

    return res.status(200).json({ message: 'Data uploaded to MongoDB successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Serve HTML page with file upload form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
