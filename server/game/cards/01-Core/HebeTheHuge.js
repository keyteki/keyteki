const Card = require('../../Card.js');

class HebeTheHuge extends Card {
    // Play: Deal 2<D> to each other undamaged creature.
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 2 damage to each undamaged creature',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 2,
                target: context.game.creaturesInPlay.filter(
                    (card) => !card.hasToken('damage') && card !== context.source
                )
            }))
        });
    }
}

HebeTheHuge.id = 'hebe-the-huge';

module.exports = HebeTheHuge;
