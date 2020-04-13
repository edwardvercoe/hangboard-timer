const body = document.querySelector('body');
const formContainer = document.querySelector('#formContainer');
const timerContainer = document.querySelector('#timerContainer');
const formSubmit = document.querySelector('#formSubmit');
const backToFormBtn = document.querySelector('.btn-back');
const repsCounter = document.querySelector('.reps-counter');
const setsCounter = document.querySelector('.sets-counter');
const startTimerButton = document.querySelector('.startTimer');
const timerDisplay = document.querySelector('.timer');
const stateTimerDisplay = document.querySelector('.state-timer');
const reps = document.querySelector("#repsInput")
const sets = document.querySelector("#setsInput")
const shortRestTime = document.querySelector("#shortRestInput")
const longRestTime = document.querySelector("#longRestInput")
const hangTime = document.querySelector("#hangTimeInput")

let paused = 0;
let running = 0;

let startTime, updatedTime, difference, tInterval, savedTime, setReps, setSets, setShortRestTime, setLongRestTime, setHangTime, workoutState, setsComplete, repsComplete, workoutTimer, stateTime, minutes, seconds, displaySeconds, displayMinutes;


function beginExercise() {
    setReps = reps.value
    setSets = sets.value
    setShortRestTime = shortRestTime.value
    setLongRestTime = longRestTime.value
    setHangTime = hangTime.value


    if (setReps.length != 0 && setSets.length != 0 && setShortRestTime.length != 0 && setLongRestTime.length != 0 && setHangTime.length != 0) {
        formContainer.classList.toggle("hide")
        timerContainer.classList.toggle("hide")
        backToFormBtn.classList.toggle("hide")

        resetTimer()
        repsCounter.innerHTML = `${repsComplete}/${setReps}`
        setsCounter.innerHTML = `${setsComplete}/${setSets}`
    } else {
        console.log('hey you enter deets')
    }

}

function backToForm() {
    formContainer.classList.toggle("hide")
    timerContainer.classList.toggle("hide")
    backToFormBtn.classList.toggle("hide")
    body.style.backgroundColor = "white"
    resetTimer()
}

function startTimer() {
    if (!running) {
        clearInterval(tInterval);
        paused = 0;
        running = 1;
        startTime = new Date().getTime();
        tInterval = setInterval(getShowTime, 1000);
        // change 1 to 1000 above to run script every second instead of every millisecond. one other change will be needed in the getShowTime() function below for this to work. see comment there.   

    } else if (!paused) {
        clearInterval(tInterval);
        savedTime = difference;
        paused = 1;
        running = 0;

    }
}


function resetTimer() {
    clearInterval(tInterval);
    savedTime = 0;
    difference = 0;
    paused = 0;
    running = 0;
    repsComplete = 0
    setsComplete = 0
    stateTime = parseInt(setShortRestTime) + 1
    workoutState = "work"
    stateTimerDisplay.innerHTML = '';
    timerDisplay.innerHTML = 'Start Timer!';
    setsCounter.innerHTML = `${setsComplete}/${setSets}`
    repsCounter.innerHTML = `${repsComplete}/${setReps}`
}

function getShowTime() {
    updatedTime = new Date().getTime();

    // OVERALL TIMER
    if (savedTime) {
        difference = (updatedTime - startTime) + savedTime;
    } else {
        difference = updatedTime - startTime;
    }

    // OVERALL COUNT
    minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    seconds = Math.floor((difference % (1000 * 60)) / 1000);

    displayMinutes = (minutes < 10) ? "0" + minutes : minutes;
    displaySeconds = (seconds < 10) ? "0" + seconds : seconds;
    timerDisplay.innerHTML = displayMinutes + ':' + displaySeconds;


    if (stateTime > 0) {
        stateTime = stateTime - 1

    } else if (stateTime == 0) {

        if (workoutState == "work") {
            repsComplete = repsComplete + 1

            if (repsComplete == setReps) {
                setsComplete = setsComplete + 1

                if (setsComplete == setSets) {
                    clearInterval(tInterval);
                    workoutState = "finish"
                    body.style.backgroundColor = "blue"
                    repsComplete = setReps
                    setsComplete = setSets
                    setsCounter.innerHTML = `${setsComplete}/${setSets}`
                    repsCounter.innerHTML = `${repsComplete}/${setReps}`
                    console.log("finished!")
                } else {
                    workoutState = "longRest"
                    workoutTimer = setLongRestTime
                    body.style.backgroundColor = "green"
                    repsComplete = 0
                    setsCounter.innerHTML = `${setsComplete}/${setSets}`
                    repsCounter.innerHTML = `${repsComplete}/${setReps}`
                    setsComplete == setSets ? workoutState = "finish" : null
                }
            } else {
                workoutState = "shortRest"
                workoutTimer = setShortRestTime
                body.style.backgroundColor = "yellow"

                repsCounter.innerHTML = `${repsComplete}/${setReps}`
            }

        } else if (workoutState == "shortRest") {

            workoutState = "work"
            workoutTimer = setHangTime
            body.style.backgroundColor = "red"

        } else if (workoutState == "longRest") {

            workoutState = "work"
            workoutTimer = setHangTime
            body.style.backgroundColor = "red"

        } else if (setsComplete == setSets) {

        } else {
            console.log("error: no workout state detected")
        }
        stateTime = workoutTimer
    }
    stateTimerDisplay.innerHTML = `${workoutState}<br /> ${stateTime}`


    console.log("state time = ", stateTime)
}