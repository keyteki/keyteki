import Card from '../../Card.js';

class HukaruIcefin extends Card {
    // After Reap: Choose a house. Exhaust each creature of that house.
    //
    // Scrap: Exhaust a creature or an artifact.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                mode: 'house'
            },
            gameAction: ability.actions.exhaust((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.hasHouse(context.house))
            }))
        });

        this.scrap({
            target: {
                cardCondition: (card) => card.type === 'creature' || card.type === 'artifact',
                gameAction: ability.actions.exhaust()
            }
        });
    }
}

HukaruIcefin.id = 'hukaru-icefin';

export default HukaruIcefin;
