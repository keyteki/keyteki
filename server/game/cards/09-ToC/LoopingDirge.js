const Card = require('../../Card.js');

class LoopingDirge extends Card {
    // Play: If you are haunted, make a token creature.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.isHaunted(),
            gameAction: ability.actions.makeTokenCreature()
        });
    }
}

LoopingDirge.id = 'looping-dirge';

module.exports = LoopingDirge;
