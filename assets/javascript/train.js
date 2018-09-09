

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCFaXvnaHL3JsKa8rsUtkAxFiUJBsPm9bQ",
    authDomain: "stfirebase-66923.firebaseapp.com",
    databaseURL: "https://stfirebase-66923.firebaseio.com",
    projectId: "stfirebase-66923",
    storageBucket: "stfirebase-66923.appspot.com",
    messagingSenderId: "367723280740"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  var trainName = "";
  var destination = "";
  var firstTime = "";
  var frequency = "";

  $(".submit").on("click", function(event) {
    event.preventDefault();

    trainName = $(".train-name").val().trim();
    destination = $(".destination").val().trim();
    firstTime = $(".first-train-time").val().trim();
    frequency = $(".frequency").val().trim();

    console.log(trainName);
    console.log(destination);
    console.log(firstTime);
    console.log(frequency);

    database.ref().push({
        name: trainName,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    $("#employee-name-input").val("");
    $("#role-input").val("");
    $("#start-input").val("");
    $("#rate-input").val("");

  });

database.ref().on("child_added", function(childSnapshot){
    console.log(childSnapshot.val());
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var firstTime = childSnapshot.val().firstTime;
    var frequency = childSnapshot.val().frequency;

    var row = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(firstTime),
        $("<td>").text(frequency)
    );

    $(".current-train-info").append(row);

});
