const Card = require('../../Card.js');

class UjkyytrPrime extends Card {
    // After Fight/After Reap: If you are overwhelmed, stun an enemy creature and each of
    // its neighbors. Otherwise, stun a creature.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            alwaysTriggers: true,
            target: {
                activePromptTitle: 'Choose a creature',
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
            }
        });
    }
}

UjkyytrPrime.id = 'ujkyytr-prime';

module.exports = UjkyytrPrime;
