var stop = false
var finalTime

export const updateTime = () => {
    if (stop) {
        return;
    }
    const now = Date.now()
    if (finalTime <= now) {
        document.getElementById("time-text").innerHTML = '0'
        return
    }

    const totalMs = finalTime - now

    const newTime = epochToString(totalMs)
    
    setTimeTextString(newTime)

    window.requestAnimationFrame(updateTime)
}

function setTimeTextString(newTime) {
    document.getElementById("time-text").innerHTML = newTime
}

function epochToString(epoch) {
    let hour = Math.floor(epoch / 3_600_000)
    let minute = Math.floor((epoch % 3_600_000) / 60_000)
    let second = Math.floor((epoch % 60_000) / 1_000)
    let ms = epoch % 1000

    let newTime = ''
    if (hour == 0 && minute == 0 && second < 10) {
        newTime = `${second}.${ms.toString().padStart(3, '0')}`
    } else {
        let omit = true
        let displays = [hour, minute, second]
        for (let i = 0; i < displays.length; i++) {
            const value = displays[i]
            if (omit && value == 0) {
                continue
            }

            if (omit) {
                omit = false
                newTime += `${value.toString()}`
            } else {
                newTime += `:${value.toString().padStart(2, '0')}`
            }
        }
    }

    return newTime
}

export function setState(newState) {
  if (newState.type == "pause") {
    showEpoch(newState.remainingEpoch)
  } else if (newState.type == "running") {
    startCountdown(newState.finalTime)
  } else if (newState.type == "standby") {
    standby()
  }
}

function tryHide(elementId) {
    const elem = document.getElementById(elementId)
    if (elem) {
        elem.hidden = true
    }
}

function tryShow(elementId) {
    const elem = document.getElementById(elementId)
    if (elem) {
        elem.hidden = false
    }
}

function startCountdown(newFinalTime) {
    finalTime = newFinalTime
    stop = false
    tryHide("resume-btn")
    tryHide("reset-btn")
    tryHide("set-btn")
    tryShow("pause-btn")
    updateTime()
}

function showEpoch(remainingEpoch) {
    stop = true
    const newTime = epochToString(remainingEpoch)
    tryShow("resume-btn")
    tryShow("reset-btn")
    tryHide("set-btn")
    tryHide("pause-btn")
    setTimeTextString(newTime)
}

function standby() {
    stop = true
    tryHide("resume-btn")
    tryHide("reset-btn")
    tryShow("set-btn")
    tryHide("pause-btn")
    setTimeTextString("0")
}

export const setSetCallback = (cb) => {
    console.log("Callback set")
    document.addEventListener("DOMContentLoaded", function() {
        console.log("Document ready")
        const elem = document.getElementById("set-btn")
        if (!elem) {
            return
        }
        elem.addEventListener("click", e => {
            console.log("Button pushed")
            cb(e)
        })
    });
}

export const setResumeCallback = (cb) => {
    console.log("Callback set")
    document.addEventListener("DOMContentLoaded", function() {
        console.log("Document ready")
        const elem = document.getElementById("resume-btn")
        if (!elem) {
            return
        }
        elem.addEventListener("click", e => {
            console.log("Button pushed")
            cb(e)
        })
    });
}

export const setResetCallback = (cb) => {
    console.log("Callback set")
    document.addEventListener("DOMContentLoaded", function() {
        console.log("Document ready")
        const elem = document.getElementById("reset-btn")
        if (!elem) {
            return
        }
        elem.addEventListener("click", e => {
            console.log("Button pushed")
            cb(e)
        })
    });
}

export const setPauseCallback = (cb) => {
    console.log("Callback set")
    document.addEventListener("DOMContentLoaded", function() {
        console.log("Document ready")
        const elem = document.getElementById("pause-btn")
        if (!elem) {
            return
        }
        elem.addEventListener("click", e => {
            console.log("Button pushed")
            cb(e)
        })
    });
}
