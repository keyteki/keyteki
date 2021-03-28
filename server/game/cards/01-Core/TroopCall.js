const Card = require('../../Card.js');

class TroopCall extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'return all friendly Niffle creatures from play and discard to hand',
            gameAction: [
                ability.actions.returnToHand((context) => ({
                    target: context.player.creaturesInPlay.filter((card) => card.hasTrait('niffle'))
                })),
                ability.actions.returnToHand((context) => ({
                    location: 'discard',
                    target: context.player.discard.filter(
                        (card) => card.type === 'creature' && card.hasTrait('niffle')
                    )
                }))
            ]
        });
    }
}

TroopCall.id = 'troop-call';

module.exports = TroopCall;
