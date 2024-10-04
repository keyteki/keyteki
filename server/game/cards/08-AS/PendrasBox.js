const Card = require('../../Card.js');

class PendrasBox extends Card {
    // This creature gains, “After Reap: Exalt this creature and each
    // of its neighbors.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.exalt((context) => ({
                    target: context.source.neighbors.concat(context.source)
                }))
            })
        });
    }
}

PendrasBox.id = 'pendra-s-box';

module.exports = PendrasBox;
