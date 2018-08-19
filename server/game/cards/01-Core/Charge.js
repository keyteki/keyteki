const Card = require('../../Card.js');

class Charge extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.forRemainderOfTurn(context => ({
                when: {
                    onCardPlayed: event => event.card.type === 'creature' && context.player === event.player
                },
                gameAction: ability.actions.cardLastingEffect({
                    effect: ability.effects.gainAbility('reaction', {
                        when: {
                            onCardPlayed: (event, context) => event.card === context.source
                        },
                        target: {
                            cardType: 'creature',
                            gameAction: ability.actions.dealDamage({ amount: 2 })
                        }
                    })
                })
            }))
        });
    }
}

Charge.id = 'charge'; // This is a guess at what the id might be - please check it!!!

module.exports = Charge;
