import Card from '../../Card.js';

class Hypoxia extends Card {
    //Play: Destroy each token creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.cardsInPlay.filter((card) => card.isToken())
            }))
        });
    }
}

Hypoxia.id = 'hypoxia';

export default Hypoxia;
