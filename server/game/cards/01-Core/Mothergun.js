const Card = require('../../Card.js');

class Mothergun extends Card {
    // Action: Reveal any number of Mars cards from your hand. Deal damage to a creature equal to the number of Mars cards revealed this way.
    setupCardAbilities(ability) {
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
            effect: '{1}',
            effectArgs: (context) => {
                const revealed = context.targets.reveal;
                const cards = Array.isArray(revealed) ? revealed : revealed ? [revealed] : [];
                const n = cards.length;
                const target = context.targets.damage;
                return n
                    ? `reveal ${cards
                          .map((c) => c.name)
                          .join(', ')} from their hand and deal ${n} damage to ${
                          target ? target.name : 'nothing'
                      }`
                    : 'reveal no Mars cards from their hand';
            }
        });
    }
}

Mothergun.id = 'mothergun';

module.exports = Mothergun;
