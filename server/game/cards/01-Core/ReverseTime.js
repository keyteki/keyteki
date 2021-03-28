const Card = require('../../Card.js');

class ReverseTime extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'swap their deck and discard pile, and shuffle their deck',
            gameAction: [
                ability.actions.moveCard((context) => ({
                    destination: 'discard',
                    target: context.player.deck
                })),
                ability.actions.moveCard((context) => ({
                    destination: 'deck',
                    shuffle: true,
                    target: context.player.discard
                }))
            ]
        });
    }
}

ReverseTime.id = 'reverse-time';

module.exports = ReverseTime;
