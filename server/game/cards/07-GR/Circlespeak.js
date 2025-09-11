const Card = require('../../Card.js');

class Circlespeak extends Card {
    // Play: Choose a creature. It captures 2A from each haunted player.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'any',
                gameAction: [
                    ability.actions.conditional((context) => ({
                        condition: context.player.isHaunted(),
                        trueGameAction: ability.actions.capture((context) => ({
                            amount: 2,
                            player: context.player,
                            target: context.target
                        }))
                    })),
                    ability.actions.conditional((context) => ({
                        condition: !!context.player.opponent && context.player.opponent.isHaunted(),
                        trueGameAction: ability.actions.capture((context) => ({
                            amount: 2,
                            player: context.player.opponent,
                            target: context.target
                        }))
                    }))
                ]
            },
            effect: 'capture 2 amber onto {0} from each haunted player'
        });
    }
}

Circlespeak.id = 'circlespeak';

module.exports = Circlespeak;
