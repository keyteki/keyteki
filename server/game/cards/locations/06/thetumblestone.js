const DrawCard = require('../../../drawcard.js');

class TheTumblestone extends DrawCard {
    setupCardAbilities(ability) {  
        this.reaction({
            when: {
                // Currently has false positive when power is moved to a character, should only trigger on 'gains'
                onCardPowerChanged: (event, card, power) => {
                    if(!card.hasTrait('House Tully') || card.getType() !== 'character' || power === 0 || !card.kneeled) {
                        return false;
                    }
                    
                    this.standCard = card;
                    return true;
                }
            },
            cost: ability.costs.discardGold(),
            handler: () => {
                this.standCard.controller.standCard(this.standCard);
                this.game.addMessage('{0} discards a gold from {1} to stand {2}', this.controller, this, this.standCard);
            }
        });
    }
}

TheTumblestone.code = '06002';

module.exports = TheTumblestone;
