const moment = require('moment');
const { EVENTS } = require('./Events/types');

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
            this.game.on(EVENTS.onGameStarted, () => this.startTimer());
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
                    'Time has been called. {0} finishes their turn, {1} takes a turn, and {0} takes their final turn until their "Forge a Key" step has been completed. If neither player has forged three keys then the tiebreakers are applied: each player forges for 6 amber , the player with the most forged keys wins, the player with the most amber wins, the player with the least chains wins, the player with the most friendly creatures wins, otherwise first player ({2}) wins.',
                    this.game.activePlayer,
                    this.game.activePlayer.opponent ? this.game.activePlayer.opponent : null,
                    this.game.firstPlayer
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
