const Card = require('../../Card.js');

class HastatusRaptor extends Card {
    // Before Fight: You may exalt Hastatus Raptor. If you do, deal 1D to the creature Hastatus Raptor fights for each A on friendly Hastatus Raptors.
    setupCardAbilities(ability) {
        this.beforeFight({
            optional: true,
            gameAction: ability.actions.exalt(),
            then: (preThenContext) => ({
                gameAction: ability.actions.dealDamage((context) => {
                    let totalAmber = context.player.creaturesInPlay
                        .filter((card) => card.name === 'Hastatus Raptor')
                        .reduce((a, b) => a + b.tokens.amber, 0);
                    return {
                        amount: totalAmber,
                        target: preThenContext.event.card
                    };
                })
            })
        });
    }
}

HastatusRaptor.id = 'hastatus-raptor';

module.exports = HastatusRaptor;
