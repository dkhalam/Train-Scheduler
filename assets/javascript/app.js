var config = {
    apiKey: "AIzaSyDyx7lwf0rrELWTxw-WNVuEPKv6brs2ro0",
    authDomain: "train-schedule-7f1e8.firebaseapp.com",
    databaseURL: "https://train-schedule-7f1e8.firebaseio.com",
    storageBucket: "train-schedule-7f1e8.appspot.com",
    messagingSenderId: "18685891232"
};

firebase.initializeApp(config);

var database = firebase.database();
// on click function for submittal of train info
        $("#submit").click(function(){
            var trainName = $("#trainName").val().trim();
            var destination = $("#destination").val().trim();
            var firstTrainTime =$("#firstTrainTime").val().trim();
            var frequency = $("#frequency").val().trim();

// create an if statement to push to firebase only if there is content in the fields
            if (trainName != "" &&
                destination != "" &&
                firstTrainTime != "" &&
                frequency != "") {

// create firebase categories to track info
                    database.ref().push({
                        trainName: trainName,
                        destination: destination, 
                        startTime: firstTrainTime,
                        frequency: frequency
                    });

                document.getElementById("#submit").value = '';
            }

            else {
                return false;
            }

        });        

//Firebase watcher
database.ref().on("child_added", function(childSnapshot) {

    //dynamically create rows to display the database values
    var $trainBody = $('#trainRows');
    var $trainRow = $('<tr>');
    var $trainName = $('<td>').html(childSnapshot.val().trainName).appendTo($trainRow);
    var $destination = $('<td>').html(childSnapshot.val().destination).appendTo($trainRow);
    var $frequency = $('<td>').html(childSnapshot.val().frequency).appendTo($trainRow); 
    
    // use moment js to convert to a certain format
    var frequency = childSnapshot.val().frequency;
    var startTime = moment(childSnapshot.val().startTime, "hh:mm").subtract(1, "years");        
    var minAway = frequency - (moment().diff(moment(startTime), "minutes") % frequency);
    
    var nextTrain = $('<td>').html(moment(moment().add(minAway, "minutes")).format("hh:mm")).appendTo($trainRow);
    var minutesAway = $('<td>').html(minAway).appendTo($trainRow);
        
    $trainRow.appendTo($trainBody);

});