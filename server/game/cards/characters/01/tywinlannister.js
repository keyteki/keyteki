const DrawCard = require('../../../drawcard.js');
 
class TywinLannister extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onBeginMarshal', 'onStatChanged', 'onCardPlayed', 'onAfterTaxation']);

        this.lastGold = 0;
    }

    updateStrength() {
        this.strengthModifier -= this.lastGold;
        this.strengthModifier += this.owner.gold;

        this.lastGold = this.owner.gold;
    }

    onBeginMarshal(player) {
        if(this.owner !== player) {
            return;
        }

        this.updateStrength();
    }

    onStatChanged(player, stat) {
        if(this.owner !== player || stat !== 'gold') {
            return;
        }

        this.updateStrength();
    }

    onCardPlayed(player) {
        if(this.owner !== player) {
            return;
        }

        this.updateStrength();
    }

    onAfterTaxation(player) {
        if(this.owner !== player) {
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
