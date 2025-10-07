import Card from '../../Card.js';

class Boiler extends Card {
    // Destroyed: Deal 6 D to each enemy flank creature.
    //
    // Scrap: Deal 1 D to each enemy creature.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 6,
                target: context.game.creaturesInPlay.filter(
                    (card) => card.controller !== context.player && card.isOnFlank()
                )
            }))
        });

        this.scrap({
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 1,
                target: context.game.creaturesInPlay.filter(
                    (card) => card.controller !== context.player
                )
            }))
        });
    }
}

Boiler.id = 'boiler';

export default Boiler;
