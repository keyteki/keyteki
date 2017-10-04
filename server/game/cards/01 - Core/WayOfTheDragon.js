const DrawCard = require('../../drawcard.js');

class WayOfTheDragon extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.increaseLimitOnAbilities(1)
        });
    }
    canAttach(player, card) {
        if(card.attachments && card.attachments.any(card => card instanceof WayOfTheDragon)) {
            return false;
        }
        return super.canAttach(player, card);
    }
}

WayOfTheDragon.id = 'way-of-the-dragon';

module.exports = WayOfTheDragon;

