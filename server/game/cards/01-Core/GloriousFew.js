const Card = require('../../Card.js');

class GloriousFew extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => !!context.player.opponent,
            gameAction: ability.actions.gainAmber(context => ({
                amount: context.player.cardsInPlay.filter(card => card.type === 'creature').length - context.player.opponent.cardsInPlay.filter(card => card.type === 'creature').length
            }))
        });
    }
}

GloriousFew.id = 'glorious-few'; // This is a guess at what the id might be - please check it!!!

module.exports = GloriousFew;
