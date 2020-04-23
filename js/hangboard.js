const body = document.querySelector('body');
const countdownDiv = document.querySelector('.countdown');
const formContainer = document.querySelector('#formContainer');
const timerContainer = document.querySelector('#timerContainer');
const formSubmit = document.querySelector('#formSubmit');
const backToFormBtn = document.querySelector('.btn-back');
const repsCounter = document.querySelector('.reps-counter');
const setsCounter = document.querySelector('.sets-counter');
const startTimerButton = document.querySelector('.startTimer');
const resetTimerButton = document.querySelector('.resetTimer');
const timerDisplay = document.querySelector('.timer');
const stateTimerDisplay = document.querySelector('.state-timer');
const stateName = document.querySelector('.state-name');
const reps = document.querySelector("#repsInput")
const sets = document.querySelector("#setsInput")
const shortRestTime = document.querySelector("#shortRestInput")
const longRestTime = document.querySelector("#longRestInput")
const hangTime = document.querySelector("#hangTimeInput")

const audio = document.querySelector('audio')

// Push animation

function pushAnim(x) {
    x.classList.remove('pulsate-bck')
    setTimeout(function(){ 
        x.classList.add('pulsate-bck')
     }, 10);
    
}

let paused = 0;
let running = 0;

let startTime, updatedTime, difference, tInterval, savedTime, setReps, setSets, setShortRestTime, setLongRestTime, setHangTime, workoutState, setsComplete, repsComplete, workoutTimer, stateTime,displayStateTime, minutes, seconds, displaySeconds, displayMinutes;

let playTimeout

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
    } else {
        console.log('hey you enter deets')
    }

}

function backToForm() {
    formContainer.classList.toggle("hide")
    timerContainer.classList.toggle("hide")
    backToFormBtn.classList.toggle("hide")
    resetTimer()
}

function startTimer() {
    if (!running) {
        clearInterval(tInterval);
        clearTimeout(playTimeout)
        pushAnim(startTimerButton)


        paused = 0;
        running = 1;
        granimInstance.changeState(workoutState);
        startTimerButton.style.backgroundColor = granimInstance.states[workoutState].gradients[0][0]
        countdownDiv.classList.add('countdown-anim')
        playTimeout = setTimeout(() => { 
            startTime = new Date().getTime();
            tInterval = setInterval(getShowTime, 1000);
            countdownDiv.classList.remove('countdown-anim')
            audio.play()
        }, 3250);

        startTimerButton.innerHTML = `<img src="img/pause.svg" alt="pause">`

        // change 1 to 1000 above to run script every second instead of every millisecond. one other change will be needed in the getShowTime() function below for this to work. see comment there.   

    } else if (!paused) {
        clearInterval(tInterval);
        clearTimeout(playTimeout)
        pushAnim(startTimerButton)
        startTimerButton.innerHTML = `<img class="playbtn" src="img/play-arrow.svg" alt="play">`
        savedTime = difference;
        paused = 1;
        running = 0;

    }
}


function resetTimer() {
    clearInterval(tInterval);
    clearTimeout(playTimeout)
    pushAnim(resetTimerButton)
    savedTime = 0;
    difference = 0;
    paused = 0;
    running = 0;
    repsComplete = 0
    setsComplete = 0
    stateTime = parseInt(setHangTime) + 1
    workoutState = "work"
    stateTimerDisplay.innerHTML = '';
    timerDisplay.innerHTML = '--:--';
    setsCounter.innerHTML = `${setsComplete}/${setSets}`
    repsCounter.innerHTML = `${repsComplete}/${setReps}`
    granimInstance.changeState("default-state");
    stateName.innerHTML = ''
    startTimerButton.style.backgroundColor = granimInstance.states['default-state'].gradients[0][0]
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
        displayStateTime = (stateTime < 10) ? "0" + stateTime : stateTime;


    } else if (stateTime == 0) {
        audio.play()

        if (workoutState == "work") {
            repsComplete = repsComplete + 1

            if (repsComplete == setReps) {
                setsComplete = setsComplete + 1

                if (setsComplete == setSets) {
                    clearInterval(tInterval);
                    workoutState = "finish"
                    granimInstance.changeState('default-state');
                    startTimerButton.style.backgroundColor = granimInstance.states['default-state'].gradients[0][0]
                    repsComplete = setReps
                    setsComplete = setSets
                    setsCounter.innerHTML = `${setsComplete}/${setSets}`
                    repsCounter.innerHTML = `${repsComplete}/${setReps}`
                    startTimerButton.innerHTML = `<img class="playbtn" src="img/play-arrow.svg" alt="play">`
                    console.log("finished!")
                } else {
                    workoutState = "longRest"
                    workoutTimer = setLongRestTime
                    granimInstance.changeState(workoutState);
                    startTimerButton.style.backgroundColor = granimInstance.states[workoutState].gradients[0][1]
                    repsComplete = 0
                    setsCounter.innerHTML = `${setsComplete}/${setSets}`
                    repsCounter.innerHTML = `${repsComplete}/${setReps}`
                    setsComplete == setSets ? workoutState = "finish" : null
                }
            } else {
                workoutState = "shortRest"
                workoutTimer = setShortRestTime
                granimInstance.changeState(workoutState);
                startTimerButton.style.backgroundColor = granimInstance.states[workoutState].gradients[0][0]
                repsCounter.innerHTML = `${repsComplete}/${setReps}`
            }

        } else if (workoutState == "shortRest") {
            
            workoutState = "work"
            workoutTimer = setHangTime
            granimInstance.changeState(workoutState);
            startTimerButton.style.backgroundColor = granimInstance.states[workoutState].gradients[0][0]

        } else if (workoutState == "longRest") {

            workoutState = "work"
            workoutTimer = setHangTime
            granimInstance.changeState(workoutState);
            startTimerButton.style.backgroundColor = granimInstance.states[workoutState].gradients[0][0]

        } else if (setsComplete == setSets) {

            granimInstance.changeState("default-state");

        } else {
            console.log("error: no workout state detected")
        }
        stateTime = workoutTimer
    }
    stateName.innerHTML = defineStateName(workoutState)
    stateTimerDisplay.innerHTML = displayStateTime


}


function defineStateName(x) {
    if (x == 'work') {
        return 'Hang'
    } else if (x == 'shortRest') {
        return 'Rest'
    } else if (x == 'longRest') {
        return 'Long rest'
    } else if (x == 'finish') {
        return 'Complete'
    } else {
        return ''
    }
}