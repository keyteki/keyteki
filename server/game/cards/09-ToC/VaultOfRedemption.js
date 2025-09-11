const Card = require('../../Card.js');

class VaultOfRedemption extends Card {
    // Each time a Mutant creature is destroyed, draw a card.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event) =>
                    event.clone.type === 'creature' && event.clone.hasTrait('mutant')
            },
            gameAction: ability.actions.draw((context) => ({
                target: context.source.controller
            }))
        });
    }
}

VaultOfRedemption.id = 'vault-of-redemption';

module.exports = VaultOfRedemption;
