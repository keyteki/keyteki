const GiganticCard = require('../../GiganticCard.js');

class DodgerS10 extends GiganticCard {
    // (Play only with the other half of Dodger’s 10.)
    // Play/After Fight/After Reap: Steal half of your opponent’s A (rounding
    // down).
    constructor(owner, cardData) {
        super(owner, cardData);
    }

    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.play({
            fight: true,
            reap: true,
            gameAction: ability.actions.steal((context) => ({
                amount: Math.floor(context.player.opponent.amber / 2)
            }))
        });
    }
}

DodgerS10.id = 'dodger-s-10';

module.exports = DodgerS10;
