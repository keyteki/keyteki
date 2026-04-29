const Card = require('../../Card.js');

class ReplicativeGrowth extends Card {
    // Play: For the remainder of the turn, each friendly creature gains,
    //
    // “After Reap: Move 1 from this creature to your pool.”
    setupCardAbilities(ability) {
        this.play({
            effect: "give each friendly creature 'Reap: Move 1 amber from this creature to your pool' for the remainder of the turn",
            gameAction: ability.actions.untilPlayerTurnEnd({
                match: (card) => card.type === 'creature',
                effect: ability.effects.gainAbility('reap', {
                    gameAction: ability.actions.removeAmber(),
                    effect: 'move 1 amber from {0} to their pool',
                    then: {
                        gameAction: ability.actions.gainAmber()
                    }
                })
            })
        });
    }
}

ReplicativeGrowth.id = 'replicative-growth';

module.exports = ReplicativeGrowth;
