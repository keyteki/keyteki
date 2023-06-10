const Card = require('../../Card.js');

class Mothergun extends Card {
    // Action: Reveal any number of Mars cards from your hand. Deal damage to a creature equal to the number of Mars cards revealed this way.
    setupCardAbilities(ability) {
        // eslint-disable-line no-unused-vars
        this.action({
            targets: {
                reveal: {
                    activePromptTitle: 'Choose which cards to reveal',
                    mode: 'unlimited',
                    controller: 'self',
                    location: 'hand',
                    cardCondition: (card) => card.hasHouse('mars')
                },
                damage: {
                    dependsOn: 'reveal',
                    activePromptTitle: 'Choose a creature to damage',
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount: context.targets.reveal
                            ? Array.isArray(context.targets.reveal)
                                ? context.targets.reveal.length
                                : 1
                            : 0
                    }))
                }
            },
            effect: 'reveal {1} from their hand, and deal {2} damage to {3}',
            effectArgs: (context) => [
                context.targets.reveal,
                context.targets.reveal.length,
                context.targets.damage
            ]
        });
    }
}

Mothergun.id = 'mothergun';

module.exports = Mothergun;
