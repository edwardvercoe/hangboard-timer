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

let startTime, startStateTime, updatedTime, stateUpdatedTime, difference, stateDifference, tInterval, savedTime,savedStateTime, setReps, setSets, setShortRestTime, setLongRestTime, setHangTime,workoutState,setsComplete,repsComplete,workoutTimer, exactSecs,stateMins;


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
        startStateTime = new Date().getTime();
        tInterval = setInterval(getShowTime, 100);
                // change 1 to 1000 above to run script every second instead of every millisecond. one other change will be needed in the getShowTime() function below for this to work. see comment there.   

    } else if (!paused) {
        clearInterval(tInterval);
        console.log(exactSecs, "exact secs")
        exactSecs ? exactSecs = exactSecs -1:null
        console.log(exactSecs, "exact secs")
        savedTime = difference;
        savedStateTime = stateDifference;
        paused = 1;
        running = 0;

    }
}


function resetTimer() {
    clearInterval(tInterval);
    savedTime = 0;
    difference = 0;
    stateDifference = 0
    paused = 0;
    running = 0;
    repsComplete = 0
    setsComplete = 0
    workoutState = "work"
    stateTimerDisplay.innerHTML = '';
    timerDisplay.innerHTML = 'Start Timer!';
    setsCounter.innerHTML = `${setsComplete}/${setSets}`
    repsCounter.innerHTML = `${repsComplete}/${setReps}`
}

function getShowTime() {
    updatedTime = new Date().getTime();
    stateUpdatedTime = new Date().getTime();

    // OVERALL TIMER
    if (savedTime) {
        difference = (updatedTime - startTime) + savedTime;
    } else {
        difference = updatedTime - startTime;
    }

    // HANG STATE TIMER
    if (savedStateTime) {
        stateDifference = (updatedTime - startStateTime) + savedTime;
    } else {
        stateDifference = updatedTime - startStateTime;
    }




    // OVERALL COUNT
    let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((difference % (1000 * 60)) / 1000);
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    timerDisplay.innerHTML = minutes + ':' + seconds;

    // WORKOUT STATE COUNT
    stateMins = Math.floor((stateDifference % (1000 * 60 * 60)) / (1000 * 60));
    exactSecs = Math.floor((stateDifference % (1000 * 60)) / 1000);
    stateMins = (stateMins < 10) ? "0" + stateMins : stateMins;
    let stateSecs = (workoutTimer - exactSecs < 10) ? "0" + (workoutTimer - exactSecs) : workoutTimer - exactSecs;

    stateTimerDisplay.innerHTML = stateMins + ':' + stateSecs;


    // WORKOUT STATE LOGIC


    if (workoutState == "work") {
        workoutTimer = setHangTime
        body.style.backgroundColor = "red"
        if (exactSecs >= setHangTime) {
            stateUpdatedTime = new Date().getTime();
            startStateTime = new Date().getTime()
            
            repsComplete = repsComplete + 1 

            if (repsComplete == setReps) {
                workoutState = "longRest"
                repsComplete = 0
                setsComplete = setsComplete + 1
                setsCounter.innerHTML = `${setsComplete}/${setSets}`
                repsCounter.innerHTML = `${repsComplete}/${setReps}`
                setsComplete == setSets ? workoutState = "finish":null
            } else {
                workoutState = "shortRest"
                repsCounter.innerHTML = `${repsComplete}/${setReps}`
            }

        }

    } else if (workoutState == "shortRest") {
        workoutTimer = setShortRestTime
        body.style.backgroundColor = "yellow"
        if (exactSecs >= setShortRestTime) {
            stateUpdatedTime = new Date().getTime();
            startStateTime = new Date().getTime()
            workoutState = "work"
        }

    } else if (workoutState == "longRest") {
        workoutTimer = setLongRestTime
        body.style.backgroundColor = "green"
        if (exactSecs >= setLongRestTime) {
            stateUpdatedTime = new Date().getTime();
            startStateTime = new Date().getTime()
            workoutState = "work"
        }
    } else if (workoutState == "finish" && setsComplete == setSets) {
        clearInterval(tInterval);
        body.style.backgroundColor = "blue"
        repsComplete = 0
        setsComplete = 0
        console.log("finished!")
    } else {
        console.log("error: no workout state detected")
    }

    // console.log(repsComplete, setReps, workoutState)
    // console.log(exactSecs)

}

