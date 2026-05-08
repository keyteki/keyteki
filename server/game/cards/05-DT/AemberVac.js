const Card = require('../../Card.js');

class AmberVac extends Card {
    // (T) Play: Raise the tide.
    // (T) This creature gains, "At the start of your turn, if the tide is high, capture 2A."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reaction', {
                when: {
                    onTurnStart: (_event, context) => context.player === context.game.activePlayer
                },
                gameAction: ability.actions.capture((context) => ({
                    target: context.source,
                    amount: context.player.isTideHigh() ? 2 : 0
                }))
            })
        });

        this.play({
            gameAction: ability.actions.raiseTide()
        });
    }
}

AmberVac.id = 'æmber-vac';

module.exports = AmberVac;
