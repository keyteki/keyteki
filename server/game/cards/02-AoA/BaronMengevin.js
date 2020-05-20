const Card = require('../../Card.js');

class BaronMengevin extends Card {
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
