const Card = require('../../Card.js');

class ScowlyCaper extends Card {
    // Skirmish.
    // Scowly Caper enters play under your opponents control and can be used as if it belonged to any house.
    // At the end of your turn, destroy one of
    // Scowly Capers neighbors.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.canUse(
                (card, context, effectContext) => card === effectContext.source
            )
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
