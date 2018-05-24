class Clock {
    constructor(player, time) {
        this.player = player;
        this.timeLeft = time;
        this.mode = 'off';
        this.timerStart = 0;
        this.paused = false;
    }

    pause() {
        this.paused = true;
    }

    restart() {
        this.paused = false;
    }

    modify(secs) {
        this.timeLeft += secs;
    }

    start() {
        if(!this.paused) {
            this.timerStart = Date.now();
        }
    }

    stop() {
        if(this.timerStart > 0) {
            this.updateTimeLeft(Math.floor(((Date.now() - this.timerStart) / 1000) + 0.5));
            this.timerStart = 0;
        }
    }

    opponentStart() {
        this.timerStart = Date.now();
    }

    timeRanOut() {
        return;
    }

    updateTimeLeft(secs) {
        if(this.timeLeft === 0) {
            return;
        }
        if(this.mode === 'down') {
            this.modify(-secs);
            if(this.timeLeft < 0) {
                this.timeLeft = 0;
                this.timeRanOut();
            }
        } else if(this.mode === 'up') {
            this.modify(secs);
        }
    }
}

module.exports = Clock;
