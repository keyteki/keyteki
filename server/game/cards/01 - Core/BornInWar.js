const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class BornInWar extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.dynamicMilitarySkill((card, context) => _.size(_.filter(context.game.rings, ring => !ring.claimed && !ring.contested)))
        });
    }
    
    canAttach(player, card) {
        if(card.hasTrait('cavalry')) {
            return super.canAttach(player, card);
        }
        return false;
    }
}

BornInWar.id = 'born-in-war';

module.exports = BornInWar;
