const DrawCard = require('../../drawcard.js');

class ReclusiveZokujin extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.rings.earth.contested,
            match: this,
            effect: ability.effects.immune({
                restricts: 'opponentsCardEffects',
                source: this
            })
        });
    }
}

ReclusiveZokujin.id = 'reclusive-zokujin'; // This is a guess at what the id might be - please check it!!!

module.exports = ReclusiveZokujin;
