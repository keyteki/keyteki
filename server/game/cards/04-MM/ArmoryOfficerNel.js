const Card = require('../../Card.js');

class ArmoryOfficerNel extends Card {
    // Enhance R. (These icons have already been added to cards in your deck.)
    // After an upgrade enters play, draw a card.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event) => event.card.type === 'upgrade'
            },
            autoResolve: true,
            gameAction: ability.actions.draw()
        });
    }
}

ArmoryOfficerNel.id = 'armory-officer-nel';

module.exports = ArmoryOfficerNel;
