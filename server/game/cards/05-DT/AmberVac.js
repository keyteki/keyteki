const Card = require('../../Card.js');

class AmberVac extends Card {
    //Play: Raise the tide.
    //This creature gains, “At the start of your turn, if the tide is high, capture 2A.”
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.raiseTide()
        });
        this.whileAttached({
            effect: ability.effects.gainAbility('reaction', {
                when: {
                    onBeginRound: (event, context) => context.player === this.game.activePlayer
                },
                condition: (context) => context.player.isTideHigh(),
                gameAction: ability.actions.capture({ amount: 2 })
            })
        });
    }
}

AmberVac.id = 'æmber-vac';

module.exports = AmberVac;
