import Card from '../../Card.js';

class StaticCollectionArray extends Card {
    // (T) Your keys cost –1A while the tide is high and +1A while the tide is low.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyKeyCost((player) =>
                player.isTideHigh() ? -1 : player.isTideLow() ? 1 : 0
            )
        });
    }
}

StaticCollectionArray.id = 'static-collection-array';

export default StaticCollectionArray;
