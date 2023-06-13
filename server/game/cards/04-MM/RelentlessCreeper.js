const Card = require('../../Card.js');

class RelentlessCreeper extends Card {
    // After you choose Dis as your active house, you may return Relentless Creeper from your discard pile to your hand.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChooseActiveHouse: (event, context) =>
                    event.player === context.player && event.house === 'dis'
            },
            optional: true,
            location: 'discard',
            gameAction: ability.actions.returnToHand((context) => ({
                location: 'discard',
                target: context.source
            }))
        });
    }
}

RelentlessCreeper.id = 'relentless-creeper';

module.exports = RelentlessCreeper;
