const Card = require('../../Card.js');

class PerilousWild extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy each elusive creature',
            gameAction: ability.actions.destroy(context => ({
                target: context.game.creaturesInPlay.filter(card => card.hasKeyword('elusive'))
            }))
        });
    }
}

PerilousWild.id = 'perilous-wild'; // This is a guess at what the id might be - please check it!!!

module.exports = PerilousWild;
