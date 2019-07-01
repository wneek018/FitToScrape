var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

//scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

//require all models
var db = require("./models");

var PORT = 3000;

//initialize express
var app = express();

//configure middleware

//use morgan logger for logging requests
app.use(logger("dev"));
//parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//make public a static folder
app.use(express.static("public"));

//connect to the Mongo DB - if deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//routes

//a GET route for scraping the nytimes website
app.get("/scrape", function(req, res) {
    //grab the body of the html with axios
    axios.get("http://www.nytimes.com/section/us").then(function(response) {
        //load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        //grab every h2 within an article tag
        $("article").each(function(i, element) {
            //save an empty result object
            var result = {};

            //add the title, summary and href of every link, and save them as properties of the result object
            result.title = $(this)
                .find("h2 a")
                .text();
            result.summary = $(this)
                .find("p")
                .text();
            result.link = $(this)
                .find("h2 a")
                .attr("href");
            result.image = $(this)
                .find("figure img")
                .attr("src");
    
            //create new Article using the result object built from scraping
            db.Article.create(result)
                .then(function(dbArticle) {
                    //view the added result in the console
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    //if error occurred, log it
                    console.log(err);
                });
        });

        //send a message to the client
        res.send("Scrape complete");
    });
});

// route for getting all Articles from the db
app.get("/articles", function(req, res) {
    //grab every document in the Articles collection
    db.Article.find({})
        .then(function(dbArticle) {
            //send found Articles back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            //if error occurred, send to client
            res.json(err);
        });
});

// route for getting a specific Article by id, populate it with its note
app.get("/articles/:id", function(req, res) {
    //using id passed in the id parameter, find the matching one in the db
    db.Article.findOne({ _id: req.params.id })
        //populate all notes associated with it
        .populate("note")
        .then(function(dbArticle) {
            // if Article found, send back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // if error occurred, send back to the client
            res.json(err);
        });
});

// route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
    //create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function(dbNote) {
            // if Note was created successfully, find one Article with the _id equal to req.params.id. Update the Article to be associated with the new Note
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function(dbArticle) {
            // if successfully update an Article, send back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            //if error occurred, send back to the client
            res.json(err);
        });
});     

// start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});