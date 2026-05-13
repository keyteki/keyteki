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
            effect: '{1}',
            effectArgs: (context) => {
                const revealed = context.targets.reveal;
                const n = Array.isArray(revealed) ? revealed.length : revealed ? 1 : 0;
                const target = context.targets.damage;
                return n
                    ? `reveal ${n} Mars card${
                          n === 1 ? '' : 's'
                      } from their hand, and deal ${n} damage to ${
                          target ? target.name : 'nothing'
                      }`
                    : 'reveal no Mars cards from their hand';
            }
        });
    }
}

Mothergun.id = 'mothergun';

module.exports = Mothergun;
