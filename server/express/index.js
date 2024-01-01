// const express = require('express');
// const multer = require('multer');
// const xlsx = require('xlsx');
// const { MongoClient } = require('mongodb');
// const path = require('path');
// const ejs = require('ejs');
// const htmlToPdf = require('html2pdf.js');

// const app = express();
// app.set("view engine","ejs")
// const PORT = 3000;

// // Set up Multer for file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // MongoDB connection URI and database name
// const mongoURI = 'mongodb+srv://sarthaksood09:VKP2eUnfR0HN2lzL@cluster0.sjhk127.mongodb.net/?retryWrites=true&w=majority';
// const dbName = 'your_database_name';
// const collectionName = 'your_collection_name';

// // MongoDB connection
// async function connectToMongoDB() {
//   const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
//   await client.connect();
//   return client.db(dbName).collection(collectionName);
// }

// // Route to handle file upload and MongoDB insertion
// app.post('/upload', upload.single('excelFile'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     const fileBuffer = req.file.buffer;
//     const workbook = xlsx.read(fileBuffer, { type: 'buffer' });

//     // Assuming the first sheet is the target sheet
//     const sheetName = workbook.SheetNames[0];
//     const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     const collection = await connectToMongoDB();
//     await collection.insertMany(sheetData);

//     return res.status(200).json({ message: 'Data uploaded to MongoDB successfully' });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Serve HTML page with file upload form
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// app.get("/gg",async(req,res)=>{
//     const collection = await connectToMongoDB();
//     const data = await collection.find().toArray();
//     console.log(data)

//     res.render('certi',{data});

    
// })

// app.get("/gk", async (req, res) => {
//     try {
//       const collection = await connectToMongoDB();
//       const data = await collection.find().toArray();
  
//       // Render EJS template with data
//       const html = await ejs.renderFile(path.join( 'views/certi.ejs'), { data });
  
//       // Convert HTML to PDF
//       const pdfOptions = { margin: 10, filename: 'report.pdf' };
//       htmlToPdf().from(html).set(pdfOptions).outputPdf((pdf) => {
//         res.contentType("application/pdf");
//         res.send(pdf);
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const { MongoClient } = require('mongodb');
const path = require('path');
const ejs = require('ejs');
const puppeteer = require('puppeteer');

const app = express();
app.set("view engine", "ejs")
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

app.get("/gg", async (req, res) => {
  try {
    const collection = await connectToMongoDB();
    const data = await collection.find().toArray();
    console.log(data);
    res.render('certi', { data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Generate PDF from EJS template using puppeteer
app.get("/gk", async (req, res) => {
  try {
    const collection = await connectToMongoDB();
    const data = await collection.find().toArray();

    // Render EJS template with data
    const html = await ejs.renderFile(path.join(__dirname, 'views/certi.ejs'), { data });

    // Generate PDF using puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf();
    await browser.close();

    // Send PDF as a response
    res.contentType("application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
