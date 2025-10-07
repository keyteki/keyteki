import Card from '../../Card.js';

class PaleIntoInsignificance extends Card {
    // Play: Destroy each creature with the lowest power.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.destroy((context) => {
                if (context.game.creaturesInPlay.length === 0) {
                    return { target: [] };
                }

                let lowestPower = context.game.creaturesInPlay.sort((a, b) => a.power - b.power)[0]
                    .power;

                return {
                    target: context.game.creaturesInPlay.filter(
                        (card) => card.power === lowestPower
                    )
                };
            })
        });
    }
}

PaleIntoInsignificance.id = 'pale-into-insignificance';

export default PaleIntoInsignificance;
