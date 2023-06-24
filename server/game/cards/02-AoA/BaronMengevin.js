const Card = require('../../Card.js');

class BaronMengevin extends Card {
    // After you discard a Sanctum card from your hand, Baron Mengevin captures 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.location === 'hand' &&
                    event.card.controller === context.player &&
                    context.game.activePlayer === context.player &&
                    event.card.hasHouse('sanctum')
            },
            gameAction: ability.actions.capture()
        });
    }
}

BaronMengevin.id = 'baron-mengevin';

module.exports = BaronMengevin;
