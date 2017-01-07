const DrawCard = require('../../../drawcard.js');
const AbilityLimit = require('../../../abilitylimit.js');

class Lightbringer extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardPowerChanged: (event, card, power) => card === this.parent && power > 0 && card.kneeled
            },
            limit: AbilityLimit.perPhase(1),
            handler: () => {
                this.parent.controller.standCard(this.parent);

                this.game.addMessage('{0} uses {1} to stand {2}', this.controller, this, this.parent);
            }
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || card.getFaction() !== this.getFaction()) {
            return false;
        }

        return super.canAttach(player, card);
    }

    attach(player, card) {
        if(card.name === 'Stannis Baratheon') {
            card.addKeyword('Renown');

            this.renownAdded = true;
        }
    }

    leavesPlay() {
        super.leavesPlay();

        if(this.renownAdded) {
            this.parent.removeKeyword('Renown');
        }
    }
}

Lightbringer.code = '01058';

module.exports = Lightbringer;
