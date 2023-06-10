const Card = require('../../Card.js');

class TheQuietAnvil extends Card {
    // Keys cost 2A.
    // After a player forges a key, destroy The Quiet Anvil.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onForgeKey: () => true
            },
            gameAction: ability.actions.destroy()
        });
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.modifyKeyCost(-2)
        });
    }
}

TheQuietAnvil.id = 'the-quiet-anvil';

module.exports = TheQuietAnvil;
