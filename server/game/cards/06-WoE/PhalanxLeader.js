const Card = require('../../Card.js');

class PhalanxLeader extends Card {
    // Play: Make a token creature immediately to Phalanx Leader's left.
    // After Fight/After Reap: Each creature to Phalanx Leader's left gets +2 power for the remainder of the turn.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature((context) => ({
                deployIndex: context.source.controller.cardsInPlay.indexOf(context.source) - 1
            }))
        });
        // TODO After Fight/After Reap: Each creature to Phalanx Leader's left gets +2 power for the remainder of the turn.
    }
}

PhalanxLeader.id = 'phalanx-leader';

module.exports = PhalanxLeader;
