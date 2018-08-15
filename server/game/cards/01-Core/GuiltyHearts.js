const Card = require('../../Card.js');

class GuiltyHearts extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy creatures with amber',
            gameAction: ability.actions.destroy(context =>
                ({ target: context.game.cardsInPlay.filter(card => card.type === 'creature' && card.hasToken('amber')) })
            )
        });
    }
}

GuiltyHearts.id = 'guilty-hearts'; // This is a guess at what the id might be - please check it!!!

module.exports = GuiltyHearts;
