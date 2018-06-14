const DrawCard = require('../../drawcard.js');

class MiyaMystic extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice to discard an attachment',
            cost: ability.costs.sacrificeSelf(),
            phase: 'conflict',
            target: {
                cardType: 'attachment',
                gameAction: ability.actions.discardFromPlay()
            }
        });
    }
}

MiyaMystic.id = 'miya-mystic';

module.exports = MiyaMystic;


