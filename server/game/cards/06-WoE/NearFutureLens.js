const Card = require('../../Card.js');

class NearFutureLens extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.player === context.source.controller,
            location: 'play area',
            effect: ability.effects.topCardOfDeckVisible(this)
        });

        this.play({
            gameAction: ability.actions.reveal((context) => ({
                target: context.player.deck[0],
                location: 'deck',
                facedown: false
            }))
        });

        this.omni({
            gameAction: ability.actions.playCard((context) => ({
                revealOnIllegalTarget: true,
                target: context.player.deck[0]
            }))
        });
    }
}

NearFutureLens.id = 'near-future-lens';

module.exports = NearFutureLens;
