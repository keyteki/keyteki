const DrawCard = require('../../drawcard.js');

class WayOfTheDragon extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.increaseLimitOnAbilities(1)
        });
    }
    canAttach(card) {
        if(card.attachments && card.attachments.any(card => card instanceof WayOfTheDragon)) {
            return false;
        } else if(card.controller !== this.controller) {
            return false;
        }
        return super.canAttach(card);
    }
}

WayOfTheDragon.id = 'way-of-the-dragon';

module.exports = WayOfTheDragon;

