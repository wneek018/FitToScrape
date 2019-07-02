var mongoose = require("mongoose");

//save reference to Schema constructor
var Schema = mongoose.Schema;

//create new NoteSchema object using Schema constructor
var NoteSchema = new Schema({
    // body is type string
    body: String
});

//creates model from above schema
var Note = mongoose.model("Note", NoteSchema);

//export Note model
module.exports = Note;