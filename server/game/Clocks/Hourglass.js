const ChessClock = require('./ChessClock');

class Hourglass extends ChessClock {
    opponentStart() {
        this.mode = 'up';
        super.opponentStart();
    }
}

module.exports = Hourglass;
