const Card = require('../../Card.js');

class FeldarsPlan extends Card {
    // Play: During your opponent's next turn, each time they play a card, steal 1A.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: 'steal an amber each time {1} plays a card during their next turn',
            effectArgs: (context) => context.player.opponent,
            effectAlert: true,
            gameAction: ability.actions.nextRoundEffect({
                when: {
                    onCardPlayed: (event, context) => {
                        console.log(event.player.name, context.player.name);
                        return event.player === context.player;
                    }
                },
                message: '{0} uses {1} to steal 1 amber from {2}',
                messageArgs: (context) => [context.player.opponent, context.source, context.player],
                gameAction: ability.actions.steal((context) => ({
                    target: context.player
                }))
            })
        });
    }
}

FeldarsPlan.id = 'feldar-s-plan';

module.exports = FeldarsPlan;
