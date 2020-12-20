let seconds = 0;
    let minutes = 0;
    let hours = 0;

    let displaySeconds = 0;
    let displayMinutes = 0;
    let displayHours = 0;

    let interval = null;
    let status = 'stopped';


    function startTimer() {
        if(document.querySelector('.time').innerHTML !== '00:00:00') {
            const time = document.querySelector('.time').innerHTML;
           
            let timeArray = time.split(':');
        
            seconds = +timeArray[2] || 0;
            minutes = +timeArray[1] || 0;
            hours = +timeArray[0] || 0;
        }

        seconds++;

        if(seconds / 60 === 1) {
            seconds = 0;
            minutes++;

            if(minutes / 60 === 1) {
                minutes = 0;
                hours++;
            }
        }

        if(seconds < 10) {
            displaySeconds = '0' + seconds.toString();
        } else {
            displaySeconds = seconds;
        }

        if(minutes < 10) {
            displayMinutes = '0' + minutes.toString();
        } else {
            displayMinutes = minutes;
        }

        if(hours < 10) {
            displayHours = '0' + hours.toString();
        } else {
            displayHours = hours;
        }

        document.querySelector('.time').innerHTML = displayHours + ":" + displayMinutes + ":" + displaySeconds;
    }

    
    function startStop() {
        if(status === 'stopped') {
            interval = window.setInterval(startTimer, 1000);
            document.querySelector('.pause-game-btn').innerHTML = 'Pause game';
            status = 'started';
        } else {
            window.clearInterval(interval);
            document.querySelector('.pause-game-btn').innerHTML = 'Continue game';
            status = 'stopped';
        }

        if(status==='stopped') {
            const puzzleOverlay = document.createElement('div');
            puzzleOverlay.classList.add('puzzle-overlay');
            document.querySelector('.puzzle-wrapper').appendChild(puzzleOverlay);
        } else {
            if(document.querySelector('.puzzle-overlay')) {
                document.querySelector('.puzzle-overlay').remove();
            }
        }
    }

    function resetTime() {
        window.clearInterval(interval);
        seconds = 0;
        minutes = 0;
        hours = 0;
        document.querySelector('.time').innerHTML = '00:00:00';
        document.querySelector('.pause-game-btn').innerHTML = 'Остановить игру';
        status = 'stopped';
    }

    export {startStop, resetTime};