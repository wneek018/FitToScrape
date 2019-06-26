var mongoose = require("mongoose");

// saves reference to Schema constructor
var Schema = mongoose.Schema;

// create a new ArticleSchema object using the Schema constructor
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    // 'note' is an object that stores a Note id. The ref property links the ObjectId to the Note model - this allows us to populate the Article with an associated Note
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// creates model from above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// exports the Article model
module.exports = Article;