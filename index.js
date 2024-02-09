const debug = require("debug")("app:startup")
const mongoose = require("mongoose");
const dbDebug = require("debug")("app:db")
const config = require("config");
const helmet = require("helmet");
const morgan = require("morgan");
const logger = require("./middleware/logger");
const express = require('express');
// const Joi = require("joi")


const app = express();
const feedback = require('./routes/feedback');


app.use(express.json())


// builtin middleware
app.use(express.urlencoded({ extended: true}));
app.use(express.static("public"));

// custome middleware
app.use(logger); 

//  third party middleware
app.use(helmet());


//  Connecting to mongoDB
mongoose.connect("mongodb://127.0.0.1:27017/feedback")
    .then(() => console.log("Connected to MongoDb.."))
    .catch(err => console.log("Error connecting to MongoDB"))


console.log(`Application name: ${config.get("name")}`);
console.log(`Mail host: ${config.get("mail.host")}`);
// console.log(`Mail Password: ${config.get("mail.password")}`);

if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    debug("Development environment!...");
}
dbDebug("Connecting to db");


app.use("/api/feedbacks", feedback);
  
const { Feedback } = require("./models/feedback")

async function createFeedback() {
    const feedback = new Feedback({
        rating: 7,
        text: "This is our Second Test",
        tags: ["Another feedback"],
        isPublished: true
    })
    const result = await feedback.save()
    console.log(result);
}

 async function getFeedback() {
    // const feedback = await Feedback.find({isPublished: true})
    const feedback = await Feedback.find({})
    .sort({rating: 1})
    .limit(10)
    .select({rating: 1, text: 1})
    .countDocuments()
    console.log(feedback);
 }


 async function updateFeedback(id){
     const feedback = await Feedback.findByIdAndUpdate(id,{
        $set:{
            rating: 10,
            isPublished: true,
            text: "This is our updated Text"
        }
     }, {new: true});
     console.log(feedback);
 }

 async function deleteFeedback(id) {
    const feedback = await Feedback.findByIdAndDelete(id);
    console.log(feedback);
 }

// deleteFeedback("65c0b3bc8d76eec0445f61dd")

//  updateFeedback('65c0b3bc8d76eec0445f61dd')



//  getFeedback()
 
// createFeedback()


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));