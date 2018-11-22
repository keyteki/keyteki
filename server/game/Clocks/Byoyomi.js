const ChessClock = require('./ChessClock');

class Byoyomi extends ChessClock {
    updateTimeLeft(secs) {
        super.updateTimeLeft(secs - (secs % 30));
    }
}

module.exports = Byoyomi;
