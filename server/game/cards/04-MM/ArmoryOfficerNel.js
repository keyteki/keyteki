const Card = require('../../Card.js');

class ArmoryOfficerNel extends Card {
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
