const Card = require('../../Card.js');

class Redacted extends Card {
    // After you choose Logos as your active house, place 1A from the common supply on [REDACTED]. When there are 4or more A on [REDACTED], sacrifice it and forge a key at no cost.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChooseActiveHouse: (event, context) =>
                    event.player === context.player && event.house === 'logos'
            },
            gameAction: ability.actions.placeAmber()
        });

        this.interrupt({
            when: {
                onAddToken: (event) =>
                    event.card === this &&
                    event.card.amber >= 3 &&
                    event.gameAction.type === 'amber'
            },
            effect: 'sacrifice {0} and forge a key at no cost',
            gameAction: [
                ability.actions.sacrifice(),
                ability.actions.forgeKey({
                    atNoCost: true
                })
            ]
        });
    }
}

Redacted.id = '[redacted]';

module.exports = Redacted;
