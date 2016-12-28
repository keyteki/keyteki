const DrawCard = require('../../../drawcard.js');

class TywinLannister extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onBeginMarshal', 'onStatChanged', 'onCardPlayed', 'onAfterTaxation']);

        this.lastGold = 0;
    }

    updateStrength() {
        this.strengthModifier -= this.lastGold;
        this.strengthModifier += this.controller.gold;

        this.lastGold = this.controller.gold;
    }

    onBeginMarshal(event, player) {
        if(this.controller !== player) {
            return;
        }

        this.updateStrength();
    }

    onStatChanged(event, player, stat) {
        if(this.controller !== player || stat !== 'gold') {
            return;
        }

        this.updateStrength();
    }

    onCardPlayed(event, player) {
        if(this.controller !== player) {
            return;
        }

        this.updateStrength();
    }

    onAfterTaxation(event, player) {
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
