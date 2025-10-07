import Phase from '../phase.js';
import ActionWindow from './actionwindow.js';

class MainPhase extends Phase {
    constructor(game) {
        super(game, 'main');
        this.initialise([new ActionWindow(game)]);
    }
}

export default MainPhase;
