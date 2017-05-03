const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const ActionWindow = require('./actionwindow.js');

class DominancePhase extends Phase {
    constructor(game) {
        super(game, 'dominance');
        this.initialise([
            new SimpleStep(game, () => this.determineWinner()),
            new ActionWindow(this.game, 'After dominance determined', 'dominance')
        ]);
    }

    determineWinner() {
        var highestDominance = 0;
        var lowestDominance = 0;
        var dominanceWinner = undefined;

        _.each(this.game.getPlayers(), player => {
            var dominance = player.getDominance();

            lowestDominance = dominance;

            if(dominance === highestDominance) {
                dominanceWinner = undefined;
            }

            if(dominance > highestDominance) {
                lowestDominance = highestDominance;
                highestDominance = dominance;
                dominanceWinner = player;
            } else {
                lowestDominance = dominance;
            }
        });

        if(dominanceWinner) {
            this.game.addMessage('{0} wins dominance ({1} vs {2})', dominanceWinner, highestDominance, lowestDominance);

            this.game.addPower(dominanceWinner, 1);
        } else {
            this.game.addMessage('There was a tie for dominance');
            this.game.addMessage('No one wins dominance');
        }

        var dominanceLoser = dominanceWinner ? this.game.getOtherPlayer(dominanceWinner) : undefined;

        this.game.raiseEvent('onDominanceDetermined', dominanceWinner, dominanceLoser);
    }
}

module.exports = DominancePhase;
