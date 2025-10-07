import ChessClock from './ChessClock.js';

class Byoyomi extends ChessClock {
    updateTimeLeft(secs) {
        super.updateTimeLeft(secs - (secs % 30));
    }
}

export default Byoyomi;
