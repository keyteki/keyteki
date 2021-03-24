const Card = require('../../Card.js');

class TheSting extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.skipStep('key')
        });

        this.reaction({
            when: {
                onForgeKey: (event, context) => event.player === context.player.opponent
            },
            gameAction: ability.actions.gainAmber((context) => ({
                amount: context.event.amberSpent
            }))
        });

        this.action({
            gameAction: ability.actions.sacrifice()
        });
    }
}

TheSting.id = 'the-sting';

module.exports = TheSting;
