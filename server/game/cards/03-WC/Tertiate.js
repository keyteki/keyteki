const Card = require('../../Card.js');

class Tertiate extends Card {
    // Play: Destroy one third of all enemy creatures and one third of all friendly creatures (rounding up each time).
    setupCardAbilities(ability) {
        this.play({
            targets: {
                enemy: {
                    mode: 'exactly',
                    cardType: 'creature',
                    controller: 'opponent',
                    numCards: (context) =>
                        context.player.opponent
                            ? Math.ceil(context.player.opponent.creaturesInPlay.length / 3)
                            : 0,
                    gameAction: ability.actions.destroy()
                },
                friendly: {
                    mode: 'exactly',
                    cardType: 'creature',
                    controller: 'self',
                    numCards: (context) => Math.ceil(context.player.creaturesInPlay.length / 3),
                    gameAction: ability.actions.destroy()
                }
            },
            effect: 'destroy 1/3 of the enemy creatures and 1/3 of the friendly creatures'
        });
    }
}

Tertiate.id = 'tertiate';

module.exports = Tertiate;
