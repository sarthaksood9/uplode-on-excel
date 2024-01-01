import express from "express";
import path from "path";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import { error } from "console";
import internal from "stream";

import validator from "validator";




const app = express();
app.use(cors());
app.use(bodyParser.json());
app.set("view engine", "ejs");




mongoose.connect('mongodb+srv://sarthaksood09:VKP2eUnfR0HN2lzL@cluster0.sjhk127.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});






const messageCollection = new mongoose.Schema({
    name: String,
    email: String
})

const msg = mongoose.model("message", messageCollection);



const signupSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
});

// Create a MongoDB model based on the schema
const Signup = mongoose.model('Signup', signupSchema);



// VKP2eUnfR0HN2lzL






app.get("/sendata", (req, res) => {
    msg.create({ name: "Sarthak2", email: "sarthaksood020@gmail.com" }).then(() => {
        console.log("message Sent to Database");
        res.send("Home page");
    }).catch((e) => {
        console.log(e);
    })
})

app.get("/json", (req, res) => {
    res.json({
        sucess: "true",
        products: [],
    })
})


app.get("/new", (req, res) => {
    res.render("indexs", { name: "sood" })
})




app.get("/", (req, res) => {
    res.render("login")
})

app.post("/login", (req, res) => {
    res.cookie("token", "iamin",);
    res.redirect("/");
})


app.post('/signup', async (req, res) => {
    try {
        // Create a new Signup instance with the data from the request body
        const newSignup = new Signup(req.body);

        // Save the new signup data to the database
        await newSignup.save();

        // Respond with a success message
        res.status(201).json({ message: 'Signup successful!' });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get("/read", (req, res) => {
    const pathlocation = path.resolve();
    res.sendFile(path.join(pathlocation, "./index.html"));
})

// async function isEmailExists(email) {
//     try {
//         // Use findOne to find a user with the given email
//         const existingUser = await User.findOne({ email });
//         // If a user is found, the email already exists
//         return !!existingUser;
//     } catch (error) {
//         console.error('Error checkinding email existence:', error);
//         // Handle the error appropriately
//         throw error;
//     }
// }


const isEmailExists = async (email) => {
    try {
        const user = await Signup.findOne({ email });
        return !!user
    }
    catch (e) {
        console.log(e);
        console.log("asfdas")
    }
}


const checkEmailExistence = async (emailToCheck) => {
    try {
        const exists = await isEmailExists(emailToCheck);

        if (exists) {
            console.log(`Email '${emailToCheck}' already exists in the database.`);
        } else {
            console.log(`Email '${emailToCheck}' does not exist in the database.`);
        }

        
    } catch (error) {
        console.error('Error checking email existence:', error);
    }
};


app.get("/checkemail", async (req, res) => {
    const { email } = req.query;
    
    try{
        const userExist=await isEmailExists(email);

        const exist=userExist;

        res.json({exist});
    }
    catch(e){
        console.log("error in check email api",e);
        res.status(500).json("Internal server error")
    }
})


app.listen(8000, () => {
    console.log("server is created");
})