const Card = require('../../Card.js');

class Arise extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'house'
            },
            gameAction: ability.actions.returnToHand(context => ({
                location: 'discard',
                target: context.player.discard.filter(card => card.type === 'creature' && card.house === context.house)
            }))
        });
    }
}

Arise.id = 'arise'; // This is a guess at what the id might be - please check it!!!

module.exports = Arise;
