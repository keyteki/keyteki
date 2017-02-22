const DrawCard = require('../../../drawcard.js');

class Riverrun extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerChanged: (event, card, power) => {
                    if(card.getType() === 'character' && card.hasTrait('House Tully')
                       && power > 0) {
                        this.tullyCharacter = card;

                        return true;
                    }
                    return false;
                }
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                if(!this.tullyCharacter) {
                    return false;
                }
                this.tullyCharacter.modifyPower(1);

                this.game.addMessage('{0} kneels {1} to have {2} gain 1 power',
                                     this.controller, this, this.tullyCharacter);

                this.tullyCharacter = undefined;
            }
        });
    }
}

Riverrun.code = '04003';

module.exports = Riverrun;
