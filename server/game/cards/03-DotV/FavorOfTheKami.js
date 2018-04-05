const DrawCard = require('../../drawcard.js');

class FavorOfTheKami extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyGlory(1)
        });
    }
}

FavorOfTheKami.id = 'favor-of-the-kami';

module.exports = FavorOfTheKami;
