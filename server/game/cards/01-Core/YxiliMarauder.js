const Card = require('../../Card.js');

class YxiliMarauder extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyPower(() => this.getAmber())
        });

        this.play({
            gameAction: ability.actions.capture(context => ({
                amount: context.player.creaturesInPlay.filter(card => card.hasHouse('mars') && !card.exhausted).length
            }))
        });
    }

    getAmber() {
        return this.hasToken('amber') ? this.tokens.amber : 0;
    }
}

YxiliMarauder.id = 'yxili-marauder'; // This is a guess at what the id might be - please check it!!!

module.exports = YxiliMarauder;
