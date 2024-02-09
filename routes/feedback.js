const express = require("express");
const router = express.Router();
const {validateFeedback} = require("../validators")
const {Feedback} = require("../models/feedback")


// router.get("/", (req, res) =>(
//     res.send("Hello World!!...")
// ))

router.get("/", async (req, res) =>{
    const feedbacks = await Feedback.find().sort({ rating: 1})
    res.send(feedbacks);
});

router.get("/:id", async (req, res) =>{
    const feedback = await Feedback.findById(req.params.id)
    if (!feedback){
        return res.status (404).send("The Feedback you are trying to reach is not available.")
    }
    res.send(feedback);
});

router.post("/", async (req, res) => {
    const { error } = validateFeedback(req.body)
    if (error) return res.status(404).send(error.details[0].message)
    

    const feedbacks = new Feedback({
        rating: req.body.rating,
        text: req.body.text,
        tag: req.body.tag,
        isPublished: req.body.isPublished
    });

    const feedback = await feedbacks.save()
    res.send(feedback);
})


router.put("/:id", async (req, res) =>{
    // checking for existing feedback
    const { error } = validateFeedback(req.body)
    if (error) {
        return res.status(404).send(error.details[0].message)
    };
    const feedback = await Feedback.findByIdAndUpdate(req.params.id,{
        $set:{
            rating: req.body.rating,
            text: req.body.text,
            tag: req.body.tag,
            isPublished: req.body.isPublished 
        }
    }, { new: true})
    
    if (!feedback){
        return res.status(404).send("The Feedback you are trying to reach is not available.")
    }
    //  validate feedback
    // module feedback
    // feedback.rating = req.body.rating
    // feedback.text = req.body.text
    res.send(feedback);
});


router.delete("/:id", async (req, res) =>{
    // checking for existing feedback
    const feedback = await Feedback.findByIdAndDelete(req.params.id)
    if (!feedback){
        return res.status(404).send("The Feedback you are trying to reach is not available.")
    }

    // const index = feedbacks.indexOf(feedback)
    //  delete feedback
    // feedbacks.splice(index, 1)
    res.send(feedback)
})

module.exports = router;