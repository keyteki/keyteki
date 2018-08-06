const DrawCard = require('../../drawcard.js');

class KatanaOfFire extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyMilitarySkill(() => this.totalKatanaModifier())
        });
    }

    canPlay(context) {
        if(!context.player.cardsInPlay.any(card => card.getType() === 'character' && card.hasTrait('shugenja'))) {
            return false;
        }

        return super.canPlay(context);
    }

    // Helper methods for clarity - TODO: needs fixing to not use this.controller
    controllerHasFireRing() {
        return this.game.rings.fire.isConsideredClaimed(this.controller);
    }
    numberOfFireCards() {
        return this.controller.getNumberOfCardsInPlay(card => card.hasTrait('fire'));
    }
    totalKatanaModifier() {
        var skillModifier = this.controllerHasFireRing() ? 2 : 0;
        skillModifier += this.numberOfFireCards();
        return skillModifier;
    }
}

KatanaOfFire.id = 'katana-of-fire';

module.exports = KatanaOfFire;
