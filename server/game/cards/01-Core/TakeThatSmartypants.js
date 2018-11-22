const Card = require('../../Card.js');

class TakeThatSmartypants extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => 
                context.player.opponent && 
                context.player.opponent.creaturesInPlay.filter(card => card.hasHouse('logos')).length >= 3,
            gameAction: ability.actions.steal({ amount: 2 })
        });
    }
}

TakeThatSmartypants.id = 'take-that-smartypants'; // This is a guess at what the id might be - please check it!!!

module.exports = TakeThatSmartypants;
