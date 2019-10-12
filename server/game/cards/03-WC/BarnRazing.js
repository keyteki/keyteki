const Card = require('../../Card.js');

class BarnRazing extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'cause his opponent to lose 1 amber each time a friendly creature fights',
            gameAction: ability.actions.forRemainderOfTurn(context => ({
                when: {
                    onFight: event => event.attacker.controller === context.player
                },
                message: '{3} loses 1 amber due to {1}\'s effect',
                messageArgs: context => [context.player.opponent],
                gameAction: ability.actions.loseAmber(context => ({
                    target: context.player.opponent
                }))
            }))
        });
    }
}

BarnRazing.id = 'barn-razing';

module.exports = BarnRazing;
