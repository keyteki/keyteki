const Card = require('../../Card.js');

class Replicator extends Card {
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                cardCondition: card => card.abilities.reactions.some(ability =>
                    Object.keys(ability.when).some(key => key === 'onReap')
                ),
                gameAction: ability.actions.resolveAbility(context => ({
                    ability: context.target.abilities.reactions.find(ability =>
                        Object.keys(ability.when).some(key => key === 'onReap')
                    )
                }))
            },
            // TODO: add a menu to choose which ability
            effect: 'trigger {0}\'s Reap: abilitiy'
        });
    }
}

Replicator.id = 'replicator'; // This is a guess at what the id might be - please check it!!!

module.exports = Replicator;
