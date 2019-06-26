// grab articles as a json
$.getJSON("/articles", function (data) {
    // loop through each article in data
    for (var i = 0; i < data.length; i++) {
        // add the id, title and link of the article to the articles id in the html file
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});

// whenever someone clicks a p tag
$(document).on("click", "p", function () {
    // empties notes from the note section
    $("#notes").empty();
    // save the id from the p tag
    var thisId = $(this).attr("data-id");

    // ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // then, add the note information to the page
        .then(function (data) {
            console.log(data);
            // title of the article
            $("#notes").append("<h2>" + data.title + "</h2>");
            // input to enter a new title
            $("#notes").append("<input id='titleinput' name='title'>");
            // textarea to add a new note body
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            // button to submit a new note with the id of the article saved to it
            $("#notes").append("<button data-id='" + data._id + "'id='savenote'>Save Note</button>");

            // if there's a note in the article
            if (data.note) {
                // put the title of the note in the title input
                $("#titleinput").val(data.note.title);
                // put the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        });
});

// whenever someone clicks the savenote button
$(document).on("click", "#savenote", function() {
    // get the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // run a POST request to change the note, using what has been entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // value taken from title input
            title: $("#titleinput").val().trim(),
            // value taken from note textarea
            body: $("#bodyinput").val().trim()
        }
    })
        .then(function(data) {
            // console.log the response
            console.log(data);
            // empty notes section
            $("#notes").empty();
        });

    // remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});