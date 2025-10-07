import Card from '../../Card.js';

class Gaius extends Card {
    // After Reap: Ward each other friendly creature with A on it.
    // Scrap: Ward a friendly creature.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.ward((context) => ({
                target: context.player.creaturesInPlay.filter(
                    (card) => card !== context.source && card.amber > 0
                )
            }))
        });

        this.scrap({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.ward()
            }
        });
    }
}

Gaius.id = 'gaius';

export default Gaius;
