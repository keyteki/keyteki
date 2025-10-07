import Clock from './Clock.js';

class Timer extends Clock {
    constructor(player, time) {
        super(player, time);
        this.mode = 'down';
    }

    timeRanOut() {
        this.player.game.addMessage("{0}'s timer has expired", this.player);
    }
}

export default Timer;
