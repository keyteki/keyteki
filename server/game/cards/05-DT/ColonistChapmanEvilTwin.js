const Card = require('../../Card.js');

class ColonistChapmanEvilTwin extends Card {
    //Elusive.
    //Play: Capture all A from each player.
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.capture((context) => ({
                    player: context.player,
                    amount: context.player.amber
                })),
                ability.actions.capture((context) => ({
                    player: context.player.opponent,
                    amount: context.player.opponent ? context.player.opponent.amber : 0
                }))
            ],
            effect: 'capture all amber from each player'
        });
    }
}

ColonistChapmanEvilTwin.id = 'colonist-chapman-evil-twin';

module.exports = ColonistChapmanEvilTwin;
