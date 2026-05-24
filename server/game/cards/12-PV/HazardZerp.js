const Card = require('../../Card.js');

class HazardZerp extends Card {
    // Play: Deal 3 damage to a creature. If that creature is destroyed, draw a card.
    // Scrap: Discard a card. Deal 3 damage to a creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 3 })
            },
            then: {
                condition: (context) =>
                    context.preThenEvent.destroyEvent &&
                    context.preThenEvent.destroyEvent.destroyedByDamageDealt &&
                    context.preThenEvent.destroyEvent.resolved,
                gameAction: ability.actions.draw()
            }
        });

        this.scrap({
            preferActionPromptMessage: true,
            target: {
                activePromptTitle: 'Choose a card to discard',
                location: 'hand',
                controller: 'self',
                gameAction: ability.actions.discard()
            },
            then: {
                alwaysTriggers: true,
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.dealDamage({ amount: 3 })
                },
                message: '{0} uses {1} to deal 3 damage to {2}'
            }
        });
    }
}

HazardZerp.id = 'hazard-zerp';

module.exports = HazardZerp;
