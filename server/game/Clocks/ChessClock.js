const Clock = require('./Clock');

class ChessClock extends Clock {
    constructor(player, time) {
        super(player, time);
        this.mode = 'stop';
    }

    start() {
        this.mode = 'down';
        super.start();
    }

    stop() {
        super.stop();
        this.mode = 'stop';
    }

    timeRanOut() {
        this.player.game.addMessage('{0}\'s clock has run out', this.player);
        if(this.player.opponent.clock.timeLeft > 0) {
            this.player.game.recordWinner(this.player.opponent, 'clock');
        }
    }
}

module.exports = ChessClock;
