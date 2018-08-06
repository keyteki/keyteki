const DrawCard = require('../../drawcard.js');

class IuchiShahai extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.reduceCost({
                match: card => card.hasTrait('meishodo'),
                targetCondition: target => target === this || target.isFaction('neutral')
            })
        });
    }
}

IuchiShahai.id = 'iuchi-shahai';

module.exports = IuchiShahai;
