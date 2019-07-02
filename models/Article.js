var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

//save reference to Schema constructor
var Schema = mongoose.Schema;

//create new ArticleSchema object using Schema constructor
var ArticleSchema = new Schema({
    // title is type string and required
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        default: "Summary not available."
    },
    // link is type string and required
    link: {
        type: String,
        unique: true,
        required: true
    },
    image: {
        type: String
    },
    saved: {
        type: Boolean,
        required: true,
        default: false
    },
    deleted: {
        type: Boolean,
        required: true,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    // note is object that stores a Note id. The ref property links the ObjectId to the Note model and allows us to populate the Article with an associated Note
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note",
        required: false
    }]
});

// plugin to make articles unique
ArticleSchema.plugin(uniqueValidator);

// creates model from the above schema
var Article = mongoose.model("Article", ArticleSchema);

//export the Article model
module.exports = Article;