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
            effect: 'discard {1} and deal 3 damage to a creature',
            effectArgs: (context) =>
                context.targets.discard ? context.targets.discard : 'nothing',
            targets: {
                discard: {
                    activePromptTitle: 'Choose a card to discard',
                    location: 'hand',
                    controller: 'self',
                    gameAction: ability.actions.discard()
                },
                damage: {
                    dependsOn: 'discard',
                    cardType: 'creature',
                    gameAction: ability.actions.dealDamage({ amount: 3 })
                }
            }
        });
    }
}

HazardZerp.id = 'hazard-zerp';

module.exports = HazardZerp;
