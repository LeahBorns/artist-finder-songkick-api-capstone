$(document).ready(function () {
    // hide everything except logo on page load
    $('.appName').hide();
    $('#searchBar').hide();

    //step 1 get the input from the user
    $("#searchBar").submit(function (event) {

        //force javacript to handle the submission
        event.preventDefault();

        //get the value from the input box
        let userSearch = $("#text-box").val();

        //use the value to call the getResults function defined below
        DataFromUser(userSearch);

        /* $(window).scroll(function () {
             if ($("#mainNav").offset().top > 100) {
                 $("#mainNav").addClass("navbar-shrink");
             } else {
                 $("#mainNav").removeClass("navbar-shrink");
             }
         });*/

        $(function () {
            $(window).on("scroll", function () {
                if ($(window).scrollTop() > 50) {
                    $("#nav_bar").addClass("active");
                } else {
                    //remove the background property so it comes transparent again (defined in your css)
                    $("#nav_bar").removeClass("active");
                }
            });
        });
    });

    //step2 using the input from the user make the API call to get the JSON response

    function DataFromUser(SearchArtist) {
        $.getJSON("https://api.songkick.com/api/3.0/search/artists.json?query=" + SearchArtist + "&apikey=ibjKuqIpOmtRftG3&jsoncallback=?",
            function (receiveData) {
                // data is JSON response object
                console.log(receiveData);
                console.log(receiveData.resultsPage.results.artist[0].id);
                //if there are no results it will empty the list
                if (receiveData.resultsPage.results.length == 0) {
                    alert("Sorry, artist not found");
                }
                //else there are results, call the display search results
                $.getJSON("https://api.songkick.com/api/3.0/artists/" + receiveData.resultsPage.results.artist[0].id + "/calendar.json?apikey=ibjKuqIpOmtRftG3&jsoncallback=?",
                    function (receiveData) {
                        // data is JSON response object
                        console.log(receiveData);
                        //if there are no results it will empty the list
                        if (receiveData.resultsPage.results.length == 0) {
                            alert("Sorry, tour dates not found");
                        }
                        //else there are results, call the display search results
                        displayResults(receiveData.resultsPage.results.event);
                    })
            })
        $('#searchBar').prop('hidden', false);
    };
})

//step3 using the JSON response, populate the relevant part of your HTML with the variable inside the JSON

function displayResults(artistArray) {

    console.log(artistArray);

    //create an empty variable to store a new list item for each result
    let buildHtmlResults = "";

    $.each(artistArray, function (artistArrayKey, artistArrayValue) {
        buildHtmlResults += "<li>";
        buildHtmlResults += "<div class='event-display-details'>";
        buildHtmlResults += "<div class='event-display-name' >" + artistArrayValue.displayName + "</div>"
        buildHtmlResults += "<div class='event-details-start-date' >" + artistArrayValue.start.date + "</div>";

        buildHtmlResults += "<div class='event-details-city' >" + artistArrayValue.location.city + "</div>";

        buildHtmlResults += "<a href='" + artistArrayValue.uri + "' class='event-details-button' target='_blank'>More Info</a>";
        buildHtmlResults += "</div>";
        buildHtmlResults += "</div>";
        buildHtmlResults += "<div class='event-details-venue' >";

        if (artistArrayValue.venue.displayName != null || artistArrayValue.location.city != null) {
            buildHtmlResults += "<iframe width='100%' height='150px'frameborder='0' style='border:0; clear: both; margin:10px;' src='https://www.google.com/maps/embed/v1/place?key=AIzaSyBdNRsY4zEYnRfcQ0_ZVVd370D7yuApzhI&q=" + artistArrayValue.venue.displayName + "," + artistArrayValue.location.city + "&maptype=roadmap' allowfullscreen></iframe>";
        }
        buildHtmlResults += "</div>";
        buildHtmlResults += "<div class='required-image' >";
        buildHtmlResults += "<img class='song-kick' src='images/poweredBySongKick.png'/>";
        buildHtmlResults += "</div>";

        buildHtmlResults += "</li>";
    });

    //use the html output to show it in the index.html
    $('#search-results ul').html(buildHtmlResults);
};

//Main logo will go up once clicked on and the form will gain focus
var flag = false;
$('#mainLogo').click(function () {
    if (!flag) {
        $(this).animate({
                top: "0px",
                left: "40px",
                width: "250px"
            }, 700, function () {
                $('.instructions, #searchBar').fadeIn(500, function () {
                    $('#text-box').focus();
                })
            } //End nested animate function
        ); //End animate
        flag = true;
    } //End if statement
}).end(); //End on hover


/*$.ajax({
    type: "GET",
    url: "https://app.ticketmaster.com/discovery/v2/events.json?size=1&apikey=AzyGvxmzSHkVQzP80eYbcPgvtlufG7gw",
    async: true,
    dataType: "json",
    success: function (json) {
        console.log(json);
        // Parse the response.
        // Do other things.
    },
    error: function (xhr, status, err) {
        // This time, we do not end up here!
    }
});*/
