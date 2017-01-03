const DrawCard = require('../../../drawcard.js');
 
class KnightsOfTheSun extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onPlotDiscarded', 'onPlotsRecycled']);
    }

    updateRenown() {
        if(this.controller.plotDiscard.size() >= 3) {
            if(!this.renownAdded) {
                this.addKeyword('Renown');
            }
        } else if(this.renownAdded) {
            this.removeKeyword('Renown');
        }
    }

    onPlotDiscarded(event, player) {
        if(player !== this.controller) {
            return;
        }

        this.updateRenown();
    }

    onPlotsRecycled(event, player) {
        if(player !== this.controller) {
            return;
        }

        this.updateRenown();        
    }

    play() {
        super.play();

        this.updateRenown();
    }

    leavesPlay() {
        super.leavesPlay();

        if(this.renownAdded) {
            this.removeKeyword('Renown');
        }
    }
}

KnightsOfTheSun.code = '02095';

module.exports = KnightsOfTheSun;
