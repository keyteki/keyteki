const Card = require('../../Card.js');

class BarnRazing extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'cause their opponent to lose 1 amber each time a friendly creature fights',
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                when: {
                    onUseCard: (event) =>
                        event.fightEvent &&
                        event.fightEvent.attackerClone.controller === context.player
                },
                gameAction: ability.actions.loseAmber((context) => ({
                    target: context.player.opponent
                }))
            }))
        });
    }
}

BarnRazing.id = 'barn-razing';

module.exports = BarnRazing;
