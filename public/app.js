//grab the articles as a JSON
$.getJSON("/articles", function(data) {
    // for each article display the info on the page
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<div class='row'> <div class='col-sm-2'> <img src='" + data[i].image + "'alt='No picture available' height='42' width='60'> </div> <div class='col-sm-10'> <p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].summary + "<br />" + data[i].link + "<br /> </p> </div> </div>");
    }
});

//whenever someone clicks a p tag
$(document).on("click", "p", function() {
    //empty notes from the note section
    $("#notes").empty();
    //save the id from the p tag
    var thisId = $(this).attr("data-id");

    //ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        //add the note info to the page
        .then(function(data) {
            console.log(data);
            //title of the article
            $("#notes").append("<h2>" + data.title + "</h2>");
            //input to endter a new title
            $("#notes").append("<input id='titleinput' name='title'>");
            //textarea to add a new note body
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            //button to submit a new note, with the article id saved to it
            $("#notes").append("<button data-id='" + data._id + "'id='savenote'>Save Note</button>");

            //if there's a note in the article
            if (data.note) {
                //place title of the note in the title input
                $("#titleinput").val(data.note.title);
                //place body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        });
});

//when you click the savenote button
$(document).on("click", "#savenote", function() {
    //grab the id associated withe the article from the submit button
    var thisId = $(this).attr("data-id");

    //run a POST request to change the note, using what was entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            //value taken from title input
            title: $("#titleinput").val(),
            //value taken from note textarea
            body: $("#bodyinput").val()
        }
    })
        .then(function(data) {
            //log the response
            console.log(data);
            //empty the notes section
            $("#notes").empty();
        });

    //remove the vales entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});