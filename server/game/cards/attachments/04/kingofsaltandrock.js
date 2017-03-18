const DrawCard = require('../../../drawcard.js');

class KingOfSaltAndRock extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addTrait('King'),
                ability.effects.addKeyword('Pillage')
            ]
        });
        this.reaction({
            when: {
                onPillage: (event, challenge, card, discarded) => discarded.getType() === 'attachment' || discarded.getType() === 'location'
            },
            handler: () => {
                this.parent.modifyPower(1);
                this.game.addMessage('{0} uses {1} to have {2} gain 1 power', this.controller, this, this.parent);
            }
        });
    }

    canAttach(player, card) {
        if(!card.hasTrait('Ironborn') || card.getType() !== 'character') {
            return false;
        }

        return super.canAttach(player, card);
    }
}

KingOfSaltAndRock.code = '04052';

module.exports = KingOfSaltAndRock;
