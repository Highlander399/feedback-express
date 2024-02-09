const express = require('express');
const Joi = require("joi")
const app = express();


app.use(express.json())
  
const books =[
    {id: 1, rating: 8, title: "Birding to Change the world"},
    {id: 2, rating: 18, title: "Omega Farm"},
    {id: 3, rating: 7, title: "Landlines"},
    {id: 4, rating: 9, title: "A Wild Path"}
]

const bookSchema = Joi.object({
    rating: Joi.number().required(),
    text: Joi.string().min(5).required()
});


app.get("/", (req, res) =>(
    res.send("List Of Books!!...")
))

app.get("/api/books", (req, res) =>{
    res.send(books).status(200)
});

app.get("/api/books/:id", (req, res) =>{
    const book = books.find((f) => f.id === parseInt(req.params.id))
    if (!book){
        return res.status (403).send("The Book is not available.")
    }
    res.send(book);
});

app.post("/api/books", (req, res) => {
    const { error } = bookSchema.validate(req.body)
    if (error) {
        return res.status(403).send(error.details[0].message)
    }

    const book = {
        id: books.length + 1,
        rating: req.body.rating,
        title: req.body.title
    };

    books.push(book)
    res.send(book);
})


app.put("/api/books/:id", (req, res) =>{
    
    const book = books.find((f) => f.id === parseInt(req.params.id))
    if (!book){
        return res.status(403).send("The book is not available.")
    }
    
    const { error } = bookSchema.validate(req.body)
    if (error) {
        return res.status(403).send(error.details[0].message)
    }
    book.rating = req.body.rating
    book.title = req.body.title
    res.send(book)
});


app.delete("/api/books/:id", (req, res) =>{
    
    const book = books.find((f) => f.id === parseInt(req.params.id))
    if (!book){
        return res.status(403).send("The Book is not available.")
    }

    const index = books.indexOf(book)
    
    books.splice(index, 1)
    res.send(book)
})

const port = process.env.NODE_ENV || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));