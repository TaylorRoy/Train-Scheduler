//function to get cursor to automatically go to train name input field of form
function setFocus() {
  var input = document.getElementById("train-name");
  input.focus();
}

// gets cursor to return to train name input field
setFocus();

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

//establishing a database variable to call the firebase database
var database = firebase.database();

//establishing variables for each input element
var trainName = "";
var destination = "";
var firstTime = "";
var frequency = "";

//when submit button is clicked, store data values to variable, push to firebase, clear fields for next entry
$(".submit").on("click", function (event) {
  event.preventDefault();

  //setting variable to values in appropriate fields
  trainName = $(".train-name").val().trim();
  destination = $(".destination").val().trim();
  firstTime = $(".first-train-time").val().trim();
  frequency = $(".frequency").val().trim();
  console.log("type of freq " + typeof frequency);
  console.log("type of first " + typeof parseInt(firstTime.replace(":", "")));

  if (trainName.length === 0 || destination.length === 0 || firstTime.length === 0 || frequency.length === 0) {
    console.log(trainName.length);
    console.log(destination.length);
    console.log(firstTime.length);
    console.log(frequency.length);
    // console.log(firstTime.toString.length);
    // console.log(frequency.toString.length);

    alert("You left some fields empty.  Try again.");
    return;
    
  }
  else if (typeof parseInt(frequency) != "number" ) {
    alert("Enter a numberic value for First Arrival and Frequency.");
    return;
  }

  // || typeof parseInt(firstTime.replace(":", "") != "number"
  else {

    console.log(trainName);
    console.log(destination);
    console.log(firstTime);
    console.log(frequency);

    //pushing data to firebase.  push allows us to add multiple children- instead of "set", which replaces old data one-at-a-time
    database.ref().push({
      name: trainName,
      destination: destination,
      firstTime: firstTime,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    //setting the fields back to blank after submitting data to firebase
    $(".train-name").val("");
    $(".destination").val("");
    $(".first-train-time").val("");
    $(".frequency").val("");
  }
});

//get firebase to report data every time a child is added.  Also calling moment.js to calculate minutes remaining and next arrival time
database.ref().on("child_added", function (childSnapshot) {

  //grabbing the values from firebase
  //console.log(childSnapshot.val());
  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var firstTime = childSnapshot.val().firstTime;
  var frequency = childSnapshot.val().frequency;

  //converting firstTime to military and subtracting a year so we don't make moment.js go past the present time when playing with site
  console.log("firstTime: " + firstTime);
  console.log(moment(firstTime), "HH:mm");
  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  console.log("firstTimeConverted: " + firstTimeConverted);

  //use moment() to create a variable equal to the present time
  var currentTime = moment();
  console.log("current time: " + moment(currentTime).format("hh:mm"));

  //subtracting firstTimeConverted from current time to get minutes that have passed since train started running
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  //finding the remainder when diffTime is divided by frequency(using modulus)
  var remainder = diffTime % parseInt(frequency);
  console.log("remainder" + remainder);

  //subtracting remainder from frequency 
  var minutesUntilArrival = frequency - remainder;
  console.log("minutesUntilArrival: " + minutesUntilArrival);

  //minutesUntilArrival is added to currentTime to calculate next arrival time
  var arrivalTime = moment().add(minutesUntilArrival, "minutes");
  console.log("ARRIVAL TIME: " + moment(arrivalTime).format("hh:mm"));

  //adding data to html dom
  var newDiv = $("<div>").addClass("row").append(
    $("<div>").addClass("table-data col-lg-2").text(trainName),
    $("<div>").addClass("table-data col-lg-2").text(destination),
    $("<div>").addClass("table-data col-lg-2").text(firstTime),
    $("<div>").addClass("table-data col-lg-2").text(frequency),
    $("<div>").addClass("table-data col-lg-2").text(minutesUntilArrival),
    $("<div>").addClass("table-data col-lg-2").text(arrivalTime.format("hh:mm"))
  );

  //appending to html dom
  $(".current-train-info").prepend(newDiv);

  // gets cursor to return to train name input field
  setFocus()
});

