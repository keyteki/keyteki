import Card from '../../Card.js';

class Unprepared extends Card {
    // Play: Choose a house. Stun each creature of that house.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'house'
            },
            gameAction: ability.actions.stun((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.hasHouse(context.house))
            }))
        });
    }
}

Unprepared.id = 'unprepared';

export default Unprepared;
