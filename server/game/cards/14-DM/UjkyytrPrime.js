const Card = require('../../Card.js');

class UjkyytrPrime extends Card {
    // After Fight/After Reap: If you are overwhelmed, stun an enemy creature and each of its neighbors. Otherwise, stun a creature.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            alwaysTriggers: true,
            target: {
                cardType: 'creature',
                cardCondition: (card, context) =>
                    !context.player.isOverwhelmed() || card.controller !== context.player,
                gameAction: ability.actions.conditional((context) => ({
                    condition: context.player.isOverwhelmed(),
                    trueGameAction: ability.actions.stun({
                        target: [context.target].concat(context.target.neighbors)
                    }),
                    falseGameAction: ability.actions.stun({ target: context.target })
                }))
            },
            effect: '{1}',
            effectArgs: (context) => {
                const t = context.target;
                if (!context.player.isOverwhelmed()) {
                    return [`stun ${t.name}`];
                }
                const neighbors = t.neighbors;
                if (neighbors.length === 0) {
                    return [`stun ${t.name}`];
                }
                if (neighbors.length === 1) {
                    return [`stun ${t.name} and its neighbor ${neighbors[0].name}`];
                }
                return [
                    `stun ${t.name} and its neighbors ${neighbors[0].name} and ${neighbors[1].name}`
                ];
            }
        });
    }
}

UjkyytrPrime.id = 'ujkyytr-prime';

module.exports = UjkyytrPrime;
