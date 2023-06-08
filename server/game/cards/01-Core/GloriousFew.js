const Card = require('../../Card.js');

class GloriousFew extends Card {
    // Play: For each creature your opponent controls in excess of you, gain 1<A>.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            gameAction: ability.actions.gainAmber((context) => ({
                amount: Math.max(
                    context.player.opponent.cardsInPlay.filter((card) => card.type === 'creature')
                        .length -
                        context.player.cardsInPlay.filter((card) => card.type === 'creature')
                            .length,
                    0
                )
            }))
        });
    }
}

GloriousFew.id = 'glorious-few';

module.exports = GloriousFew;
