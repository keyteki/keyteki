const Card = require('../../Card.js');

class EdaiEdie4x4 extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                location: 'hand',
                controller: 'self',
                gameAction: ability.actions.archive()
            }
        });
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(
                (player) => (player.opponent && player.opponent.archives.length) || 0
            )
        });
    }
}

EdaiEdie4x4.id = 'edai-edie-4x4';

module.exports = EdaiEdie4x4;
