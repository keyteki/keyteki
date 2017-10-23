const DrawCard = require('../../drawcard.js');

class DoomedShugenja extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Play Doomed Shugenja',
            cost: [ability.costs.playLimited(), ability.costs.chooseFate(0), ability.costs.payReduceableFateCost('play')],
            condition: () => !this.facedown && this.controller.canPutIntoPlay(this),
            phase: 'dynasty',
            location: 'province',
            printedAbility: false,
            cannotBeCopied: true,
            cannotBeCancelled: true,
            handler: () => {
                this.controller.putIntoPlay(this);
                this.game.addMessage('{0} plays {1} with {2} additional fate', this.controller, this, this.fate);
            }
        });
    }
    
    canPlay() {
        return false;
    }
}

DoomedShugenja.id = 'doomed-shugenja';

module.exports = DoomedShugenja;
