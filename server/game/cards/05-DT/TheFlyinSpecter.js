const Card = require('../../Card.js');

class TheFlyinSpecter extends Card {
    //After your opponent raises the tide, destroy $this.
    //Action: Steal 1A if the tide is high.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onRaiseTide: (event, context) => event.player !== context.player
            },
            gameAction: ability.actions.destroy((context) => ({
                target: context.source
            }))
        });

        this.action({
            condition: (context) => context.player.isTideHigh(),
            gameAction: ability.actions.steal()
        });
    }
}

TheFlyinSpecter.id = 'the-flyin--specter';

module.exports = TheFlyinSpecter;
