const Card = require('../../Card.js');

class ScowlyCaper extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.canUse((card) => card === this)
        });

        this.persistentEffect({
            location: 'any',
            targetController: 'any',
            effect: ability.effects.entersPlayUnderOpponentsControl()
        });

        this.interrupt({
            when: {
                onRoundEnded: (event, context) => context.player === this.game.activePlayer
            },
            target: {
                cardType: 'creature',
                cardCondition: (card, context) => context.source.neighbors.includes(card),
                gameAction: ability.actions.destroy()
            }
        });
    }
}

ScowlyCaper.id = 'scowly-caper';

module.exports = ScowlyCaper;
