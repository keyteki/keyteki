const DrawCard = require('../../../drawcard.js');
 
class TywinLannister extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onBeginMarshal', 'onStatChanged', 'onCardPlayed', 'onAfterTaxation']);

        this.lastGold = 0;
    }

    updateStrength() {
        if(!this.inPlay) {
            return;
        }
        
        this.strengthModifier -= this.lastGold;
        this.strengthModifier += this.controller.gold;

        this.lastGold = this.controller.gold;
    }

    onBeginMarshal(e, player) {
        if(this.controller !== player) {
            return;
        }

        this.updateStrength();
    }

    onStatChanged(e, player, stat) {
        if(this.controller !== player || stat !== 'gold') {
            return;
        }

        this.updateStrength();
    }

    onCardPlayed(e, player) {
        if(this.controller !== player) {
            return;
        }

        this.updateStrength();
    }

    onAfterTaxation(e, player) {
        if(this.controller !== player) {
            return;
        }

        this.updateStrength();        
    }

    getIncome() {
        return 2;
    }
}

TywinLannister.code = '01090';

module.exports = TywinLannister;
