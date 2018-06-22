const DrawCard = require('../../drawcard.js');

class WayOfTheDragon extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.increaseLimitOnAbilities(1)
        });
    }
    canAttach(card, context) {
        if(card.attachments && card.attachments.any(card => card.id === 'way-of-the-dragon' && card !== this)) {
            return false;
        } else if(card.controller !== context.player) {
            return false;
        }
        return super.canAttach(card, context);
    }
}

WayOfTheDragon.id = 'way-of-the-dragon';

module.exports = WayOfTheDragon;

