import Card from '../../Card.js';

class Ostracize extends Card {
    // Play: Lose 1A. If you do, purge a creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.loseAmber((context) => ({
                target: context.player
            })),
            then: {
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.purge()
                }
            }
        });
    }
}

Ostracize.id = 'ostracize';

export default Ostracize;
