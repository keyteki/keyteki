const DrawCard = require('../../../drawcard.js');

class RobertBaratheon extends DrawCard {
    setupCardAbilities(dsl) {
        this.persistentEffect({
            match: card => card === this,
            effect: dsl.effects.dynamicStrength(() => this.calculateStrength())
        });
    }

    calculateStrength() {
        return this.game.allCards.reduce((counter, card) => {
            if(card === this || card.location !== 'play area' || card.getType() !== 'character' || !card.kneeled) {
                return counter;
            }

            return counter + 1;
        }, 0);
    }
}

RobertBaratheon.code = '01048';

module.exports = RobertBaratheon;
