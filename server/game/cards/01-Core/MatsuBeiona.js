const DrawCard = require('../../drawcard.js');

class MatsuBeiona extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Put 2 fate on this character',
            when: {
                onCharacterEntersPlay: (event, context) => (
                    event.card === context.source &&
                    context.player.cardsInPlay.filter(card => (
                        card.hasTrait('bushi') &&
                        card !== context.source
                    )).length >= 3
                )
            },
            gameAction: ability.actions.placeFate({ amount: 2 })
        });
    }
}

MatsuBeiona.id = 'matsu-beiona';

module.exports = MatsuBeiona;
