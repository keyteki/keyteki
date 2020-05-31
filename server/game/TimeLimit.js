const moment = require('moment');

class TimeLimit {
    constructor(game) {
        this.game = game;
        this.timeLimitStartType = null;
        this.timeLimitStarted = false;
        this.timeLimitStartedAt = null;
        this.timeLimitInMinutes = null;
        this.isTimeLimitReached = false;
    }

    initialiseTimeLimit(timeLimitStartType, timeLimitInMinutes) {
        this.timeLimitStartType = timeLimitStartType;
        this.timeLimitInMinutes = timeLimitInMinutes;
        if (timeLimitStartType === 'whenSetupFinished') {
            this.game.on('onGameStarted', () => this.startTimer());
        }
    }

    startTimer() {
        if (!this.timeLimitStarted) {
            this.timeLimitStarted = true;
            this.timeLimitStartedAt = new Date();
            this.timer = setInterval(() => {
                this.checkForTimeLimitReached();
            }, 1000);
        }
    }

    checkForTimeLimitReached() {
        if (this.game.useGameTimeLimit && !this.isTimeLimitReached) {
            let differenceBetweenStartOfTimerAndNow = moment.duration(
                moment().diff(this.timeLimitStartedAt)
            );
            if (differenceBetweenStartOfTimerAndNow.asSeconds() / 60 >= this.timeLimitInMinutes) {
                this.game.addAlert(
                    'warning',
                    'Time up.  The game will end after the current round has finished'
                );
                this.isTimeLimitReached = true;
                this.timeLimitStarted = false;
                this.game.timeExpired();
            }
        } else if (this.isTimeLimitReached && this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }
}

module.exports = TimeLimit;
