import Card from '../../Card.js';

class WarOfTheWorlds extends Card {
    // Play: Destroy all non-Mars creatures. Deal 2 D to each Mars
    // creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequential([
                ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay.filter((c) => !c.hasHouse('mars'))
                })),
                ability.actions.dealDamage((context) => ({
                    target: context.game.creaturesInPlay.filter((c) => c.hasHouse('mars')),
                    amount: 2
                }))
            ]),
            effect: 'destroy each non-Mars creature and deal 2 damage to each Mars creature'
        });
    }
}

WarOfTheWorlds.id = 'war-of-the-worlds';

export default WarOfTheWorlds;
