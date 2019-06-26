var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// require all models
var db = require("./models");

var PORT = 3000;

// initialize express
var app = express();

// Configure Middleware

// use morgan logger for logging requests
app.use(logger("dev"));
// parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// make public a static folder
app.use(express.static("public"));

// connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// Routes

// GET route for scraping the Medium website
app.get("/scrape", function(req, res) {
    // grab the body of the html with axios
    axios.get("https://www.medium.com/").then(function(response) {
        // load into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // grab every h2 within an article tag, and do the following:
        $("article h2").each(function(i, element) {
            // save an empty result object
            var result = {};

            // add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children("a")
                .children("aria-label");
            result.link = $(this)
                .children("a")
                .attr("href");

            // create a new Article using the 'result' object built from scraping
            db.Article.create(result)
                .then(function(dbArticle) {
                    // console.log the result
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    // log the error
                    console.log(err);
                });
        });
        // send message to the client
        res.send("Scrape complete");
    });
});

// route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // get every document in the Articles collection
    db.Article.find({})
        .then(function(dbArticle) {
            // if Articles found, send them back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // if error occurred, send to the client
            res.json(err);
        });
});

// route for getting specific Article by id, populate it with its note
app.get("/articles/:id", function(req, res) {
    // using the id passed in the id parameter, prepare a query that finds the matching one in our db
    db.Article.findOne({ _id: req.params.id })
        // populate all of the notes associated with it
        .populate("note")
        .then(function(dbArticle) {
            // if Article found with id, send back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // if error occurred, send to the client
            res.json(err);
        });
});

// route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
    // create new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function(dbNote) {
            // if note was created, find one Article with '_id' equal to 'req.params.id'. Update the Article to be associated with the new Note - { new: true } returns the updated User
            return db.Article.findByIdAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function(dbArticle) {
            // if Article found, send back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // if error occurred, send back to the client
            res.json(err);
        });
});

// start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});