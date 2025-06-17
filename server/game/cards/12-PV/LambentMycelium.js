const Card = require('../../Card.js');

class LambentMycelium extends Card {
    // After another creature enters play, put two +1 power counters on Lambent Mycelium.
    // Fate: Until the end of your turn, the most powerful enemy creatures gain taunt.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.type === 'creature' && event.card !== context.source
            },
            gameAction: ability.actions.addPowerCounter({ amount: 2 })
        });

        this.fate({
            target: {
                controller: 'self',
                cardType: 'creature',
                mode: 'mostStat',
                cardStat: (card) => card.power,
                gameAction: ability.actions.cardLastingEffect({
                    effect: ability.effects.addKeyword({ taunt: 1 })
                })
            },
            effect: 'give {1} taunt for the remainder of the turn',
            effectArgs: (context) => [context.target]
        });
    }
}

LambentMycelium.id = 'lambent-mycelium';

module.exports = LambentMycelium;
