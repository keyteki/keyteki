const Card = require('../../Card.js');

class IgonTheGreen extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            effectStyle: 'append',
            gameAction: [
                ability.actions.purge(),
                ability.actions.returnToHand((context) => ({
                    location: 'discard',
                    target: context.player.discard.find((card) => card.name === 'Igon the Terrible')
                }))
            ]
        });
    }
}

IgonTheGreen.id = 'igon-the-green';

module.exports = IgonTheGreen;
