const Card = require('../../Card.js');

class Redacted extends Card {
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
                ability.actions.forgeKey((context) => ({
                    modifier: -context.player.getCurrentKeyCost()
                }))
            ]
        });
    }
}

Redacted.id = '[redacted]';

module.exports = Redacted;
