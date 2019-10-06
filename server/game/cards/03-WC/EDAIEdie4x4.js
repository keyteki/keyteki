const Card = require('../../Card.js');

class EDAIEdie4x4 extends Card {
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
            effect: ability.effects.modifyKeyCost(() => this.controller.archives.length || 0)
        });
    }
}

EDAIEdie4x4.id = 'edai-edie-4x4';

module.exports = EDAIEdie4x4;
