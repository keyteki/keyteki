const DrawCard = require('../../../drawcard.js');
 
class Dawn extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onPlotDiscarded', 'onPlotsRecycled']);
        this.plotStrength = 0;
    }

    updateStrength() {
        this.parent.strengthModifier -= this.plotStrength;

        this.plotStrength = this.controller.plotDiscard.size();

        this.parent.strengthModifier += this.plotStrength;
    }

    onPlotDiscarded(event, player) {
        if(player !== this.controller) {
            return;
        }

        this.updateStrength();
    }

    onPlotsRecycled(event, player) {
        if(player !== this.controller) {
            return;
        }

        this.updateStrength();        
    }

    attach(player, card) {
        super.attach(player, card);

        this.updateStrength();

        if(card.hasTrait('House Dayne')) {
            card.addKeyword('Intimidate');

            this.initimidateAdded = true;
        }
    }

    leavesPlay() {
        super.leavesPlay();

        if(this.initimidateAdded) {
            this.removeKeyword('Intimidate');
        }

        this.parent.strengthModifier -= this.plotStrength;
    }
}

Dawn.code = '01115';

module.exports = Dawn;
