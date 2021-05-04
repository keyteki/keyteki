const Card = require('../../Card.js');

class SnagsMirror extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChooseActiveHouse: () => true
            },
            gameAction: ability.actions.lastingEffect((context) => ({
                targetController: 'any',
                effect: ability.effects.stopHouseChoice(context.event.house)
            }))
        });
    }
}

SnagsMirror.id = 'snag-s-mirror';

module.exports = SnagsMirror;
