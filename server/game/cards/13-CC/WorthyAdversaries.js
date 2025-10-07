import Card from '../../Card.js';

class WorthyAdversaries extends Card {
    // Play: Deal 1 damage to 2 different enemy creatures. Exalt each damaged creature in play.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'exactly',
                numCards: 2,
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({ amount: 1 })
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.exalt((context) => ({
                    target: context.game.creaturesInPlay.filter((card) => card.hasToken('damage'))
                }))
            }
        });
    }
}

WorthyAdversaries.id = 'worthy-adversaries';

export default WorthyAdversaries;
