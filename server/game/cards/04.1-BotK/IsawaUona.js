const DrawCard = require('../../drawcard.js');

class IsawaUona extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Bow a non-unique character in the conflict',
            when: {
                onCardPlayed: (event, context) => event.player === context.player && event.card.hasTrait('air') && this.game.isDuringConflict()
            },
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                controller: 'any',
                cardCondition: card => card.isParticipating() && !card.isUnique(),
                gameAction: ability.actions.bow()
            }
        });
    }
}

IsawaUona.id = 'isawa-uona';

module.exports = IsawaUona;
