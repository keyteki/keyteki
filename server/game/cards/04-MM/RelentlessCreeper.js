const Card = require('../../Card.js');

class RelentlessCreeper extends Card {
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
