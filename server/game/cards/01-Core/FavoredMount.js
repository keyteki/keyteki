const DrawCard = require('../../drawcard.js');

class FavoredMount extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addTrait('cavalry')
        });
        this.action({
            title: 'Move this character into the conflict',
            cost: ability.costs.bowSelf(),
            gameAction: ability.actions.moveToConflict(context => ({ target: context.source.parent }))
        });
    }

    canAttach(card, context) {
        if(card.controller !== context.player) {
            return false;
        }
        return super.canAttach(card, context);
    }
}

FavoredMount.id = 'favored-mount';

module.exports = FavoredMount;
