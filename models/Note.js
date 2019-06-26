var mongoose = require("mongoose");

// saves reference to Schema constructor
var Schema = mongoose.Schema;

// create a new NoteSchema object using the Schema constructor
var NoteSchema = new Schema({
    title: String,
    body: String
});

// creates model from above schema, using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

// exports the Note model
module.exports = Note;