import Card from '../../Card.js';

class BatarielOfTheGrey extends Card {
    // After Reap: Ready each Disciple.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.ready((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.name === 'Disciple')
            }))
        });
    }
}

BatarielOfTheGrey.id = 'batariel-of-the-grey';

export default BatarielOfTheGrey;
