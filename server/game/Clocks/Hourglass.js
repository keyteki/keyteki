import ChessClock from './ChessClock.js';

class Hourglass extends ChessClock {
    opponentStart() {
        this.mode = 'up';
        super.opponentStart();
    }
}

export default Hourglass;
