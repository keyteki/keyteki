const DrawCard = require('../../drawcard.js');

class AwakenedTsukumogami extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: Object.values(this.game.rings).map(ring =>
                ability.effects.alternateFatePool(card => card.isConflict && ring.getElements().some(element => card.hasTrait(element)) && ring)
            )
        });
    }
}

AwakenedTsukumogami.id = 'awakened-tsukumogami';

module.exports = AwakenedTsukumogami;
