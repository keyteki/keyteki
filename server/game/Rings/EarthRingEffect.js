const BaseAbility = require('../baseability.js');

class EarthRingEffect extends BaseAbility {
    constructor(optional = true) {
        super({});
        this.title = 'Resolve the Earth Ring';
        this.optional = optional;
    }

    meetsRequirements() {
        return true;
    }

    executeHandler(context) {
        if(context.player.opponent) {
            context.game.addMessage('{0} resolves the {1} ring, drawing a card and forcing {2} to discard a card at random', context.player, 'earth', context.player.opponent);
            context.player.opponent.discardAtRandom(1);
        } else {
            context.game.addMessage('{0} resolves the {1} ring, drawing a card', context.player, 'earth');
        }
        context.player.drawCardsToHand(1);
    }

    isAction() {
        return false;
    }

    isCardAbility() {
        return false;
    }
}

module.exports = EarthRingEffect;
