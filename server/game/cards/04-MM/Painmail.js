const Card = require('../../Card.js');

class Painmail extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reaction', {
                when: {
                    onChooseActiveHouse: (event) => event.house === 'dis'
                },
                effect: 'archive {1} and destroy {2}',
                effectArgs: (context) => [this, context.source],
                gameAction: ability.actions.sequential([
                    ability.actions.archive({
                        target: this
                    }),
                    ability.actions.destroy((context) => ({
                        target: context.source
                    }))
                ])
            })
        });
    }
}

Painmail.id = 'painmail';

module.exports = Painmail;
