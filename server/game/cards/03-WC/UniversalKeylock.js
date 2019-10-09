const Card = require('../../Card.js');

class UniversalKeylock extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.modifyKeyCost(3)
        });
        this.reaction({
            when: {
                onForgeKey: () => true
            },
            effect: 'destroy itself',
            gameAction: ability.actions.destroy()
        });
    }
}

UniversalKeylock.id = 'universal-keylock';

module.exports = UniversalKeylock;
