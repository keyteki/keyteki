const Card = require('../../Card.js');
// After Reap: For each exhausted creature to Praetor Marius`s left, capture 1 Aember.
class PraetorMarius extends Card {
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.capture((context) => ({
                amount: context.player.creaturesInPlay.filter(
                    (card) =>
                        card.exhausted &&
                        card.controller.cardsInPlay.indexOf(card) <
                            card.controller.cardsInPlay.indexOf(context.source)
                ).length
            }))
        });
    }
}

PraetorMarius.id = 'praetor-marius';

module.exports = PraetorMarius;
