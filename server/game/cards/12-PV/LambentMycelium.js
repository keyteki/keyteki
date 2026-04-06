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
            gameAction: ability.actions.untilPlayerTurnEnd((context) => {
                const enemyCreatures = context.player.creaturesInPlay;
                const highestPower =
                    enemyCreatures.length > 0
                        ? Math.max(...enemyCreatures.map((card) => card.power))
                        : 0;

                return {
                    effect: ability.effects.addKeyword({ taunt: 1 }),
                    match: (card) =>
                        card.type === 'creature' &&
                        card.controller === context.player &&
                        card.power === highestPower
                };
            }),
            effect: 'give taunt to each most powerful enemy creature for the remainder of the turn'
        });
    }
}

LambentMycelium.id = 'lambent-mycelium';

module.exports = LambentMycelium;
