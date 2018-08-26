/**
 * This function adds zeros before h/m/s if the they're in the range of [0;9]
 * I had to use arrays because passing parameters by value was necessary and
 * "Javascript is always passed by value, but when a variable refers to an object (including arrays),
 * the "value" is a reference to the object."
 * For more information: http://stackoverflow.com/questions/6605640/javascript-by-reference-vs-by-value
 */
function preZeros(arr) {
    if (arr[0] >= 0 && arr[0] < 10) {
        arr[0] = ("0" + arr[0]).toString();
    }
    if (arr[1] >= 0 && arr[1] < 10) {
        arr[1] = ("0" + arr[1]).toString();
    }
    if (arr[2] >= 0 && arr[2] < 10) {
        arr[2] = ("0" + arr[2]).toString();
    }
}

/* Sets current time in input fields, makes them accessible
 * and returns everything back to their initial position
 */
window.addEventListener("load", toInitial);
function toInitial() {
    document.getElementById("timeleftInfo").style.display = "none";

    var t = document.getElementById("timeInputField");

    var time = new Date();
    var h = time.getHours();
    var m = time.getMinutes();
    var s = time.getSeconds();
    var arr = [h, m, s];
    preZeros(arr);
    t.value = arr[0] + ":" + arr[1] + ":" + arr[2];

    t.removeAttribute("disabled");
    t.style.cursor = "default";
    t.focus();

    document.getElementById("setButton").removeAttribute("disabled");
    document.getElementById("setButton").style.cursor = "pointer";

    document.getElementById("exceptionErrorMessage").innerHTML = "";

    document.getElementById("welcome").style.visibility = "visible";
    document.getElementById("welcome").style.position = "relative";

}

//Clears the alarm and returns properties back to their initial position
document.getElementById("clearButton").addEventListener("click", clearAlarm);
function clearAlarm() {
    clearTimeout(setTimeoutVar);
    clearInterval(setIntVar);

    toInitial();
}

//Informs an user about how much time left before the alarm goes off
var col1 = document.getElementById("colon1");
var col2 = document.getElementById("colon2");
function timeLeft(fireTimeInMilliseconds) {
    var fireAfterInMilliSecs = fireTimeInMilliseconds - new Date().getTime();
    var fireAfterInDate = new Date(fireAfterInMilliSecs);

    var arr = [
        fireAfterInDate.getHours() - 4, //It adds 4 to hours but I've no idea why
        fireAfterInDate.getMinutes(),
        fireAfterInDate.getSeconds()
    ];
    preZeros(arr);
    document.getElementById("h").innerHTML = arr[0];
    document.getElementById("m").innerHTML = arr[1];
    document.getElementById("s").innerHTML = arr[2];

    if (col1.style.visibility == "visible" && col2.style.visibility == "visible") {
        col1.style.visibility = "hidden";
        col2.style.visibility = "hidden";
    } else {
        col1.style.visibility = "visible";
        col2.style.visibility = "visible";
    }
}

//Sets the alarm and disables the input fields when 'Set alarm' button is clicked
var setTimeoutVar, setIntVar;
document.getElementById("setButton").addEventListener("click", function () {
    var inputValue = document.getElementById("timeInputField").value;
    var inputValueArr = inputValue.split(':');

    var fireTime = new Date();
    fireTime.setHours(inputValueArr[0]);
    fireTime.setMinutes(inputValueArr[1]);
    fireTime.setSeconds(inputValueArr[2]);

    var fireAfter = fireTime.getTime() - new Date().getTime();
    if (fireAfter < 0) {
        document.getElementById("exceptionErrorMessage").innerHTML =
            "This is a 24 hour format alarm, so make sure you set the alarm in the future!";
        return;
    } else {
        document.getElementById("welcome").style.visibility = "hidden";
        document.getElementById("welcome").style.position = "absolute";

        document.getElementById("exceptionErrorMessage").innerHTML = "";

        document.getElementById("timeInputField").setAttribute("disabled", "disabled");
        document.getElementById("timeInputField").style.cursor = "not-allowed";

        document.getElementById("setButton").setAttribute("disabled", "disabled");
        document.getElementById("setButton").style.cursor = "not-allowed";

        setIntVar = setInterval(function () {
            document.getElementById("timeleftInfo").style.display = "block";
            timeLeft(fireTime.getTime());
        }, 1000);

        setTimeoutVar = setTimeout(function () {
            createNotification();
            clearInterval(setIntVar);
            toInitial();
        }, fireAfter);
    }
});

//This functions generates a notification
function createNotification() {
    // Let's check if the browser supports notifications
    if (!Notification) {
        alert('Desktop notifications are not supported in your browser.');
        return;
    }
    else if (Notification.permission !== "granted") {
        //This may not be neccessary because notifications permision
        //is already requested via manifest.json
        Notification.requestPermission();
    }

    var options = {
        icon: "Icons/icon128.png",
        body: "Time is up!",
        requireInteraction: true
    };
    var notification = new Notification("Alarm Notification", options);

    //A notification has a "show" event that occurs when it is displayed
    //notification.addEventListener("show", function () {
    //    document.getElementById("notifAudio").play();

    //});
    //You can also do like these
    notification.onshow = function () {
        var audio = new Audio('Sounds/notify.wav');
        audio.play();
    };
    notification.onclick = function () {
        notification.close();
    };
    notification.onclose = function () {
        var audio = new Audio('Sounds/close.wav');
        audio.play();
    };
}
