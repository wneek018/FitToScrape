var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require("cheerio");
var Article = require("../../models/Article");
var Note = require("../../models/Note");

//get all notes
router.get("/", function(req, res) {
    Note
        .find({})
        .exec(function(err, notes) {
            if (err) {
                console.log(err);
                res.status(500);
            } else {
                res.status(200).json(notes);
            }
        });
});

//add a note to a saved article
router.post("/:id", function(req, res) {
    let newNote = new Note(req.body);
    //console.log(req.body);
    newNote.save(function(err, doc) {
        if (err) {
            console.log(err);
            res.status(500);
        } else {
            Article.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { "notes": doc.id } },
                function(error, newDoc) {
                    if (error) {
                        console.log(error);
                        res.status(500);
                    } else {
                        res.redirect("/saved");
                    }
                }
            );
        }
    });
});

//delete a note from a saved article
router.post("/delete/:id", function(req, res) {
    Note.findByIdAndRemove(req.params.id, function(err, note) {
        if (err) {
            console.log(err);
            res.status(500);
        } else {
            res.redirect("/saved");
        }
    });
});

module.exports = router;