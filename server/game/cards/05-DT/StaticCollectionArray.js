const Card = require('../../Card.js');

class StaticCollectionArray extends Card {
    //Your keys cost -1A while the tide is high and +1A while the tide is low.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyKeyCost((context) =>
                context.player.isTideHigh() ? 1 : -1
            )
        });
    }
}

StaticCollectionArray.id = 'static-collection-array';

module.exports = StaticCollectionArray;
