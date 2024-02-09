const mongoose = require("mongoose");


const feedbackSchema = new mongoose.Schema({
    rating: {type: Number, required: true},
    text: {type: String, required: true, minLength: 5},
    tags: [ String ],
    date: {type: Date, default: Date.now},
    isPublished: {type: Boolean}
})

const Feedback = mongoose.model("Feedback", feedbackSchema)


module.exports.Feedback = Feedback