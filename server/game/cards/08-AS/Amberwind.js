import Card from '../../Card.js';

class Amberwind extends Card {
    // Play: Exalt Æmberwind 3 times.
    // After Reap: Move 1A from Æmberwind to your pool.
    setupCardAbilities(ability) {
        this.play({
            effect: 'exalt {0} 3 times',
            gameAction: [ability.actions.exalt(), ability.actions.exalt(), ability.actions.exalt()]
        });

        this.reap({
            gameAction: ability.actions.returnAmber((context) => ({
                amount: 1,
                target: context.source,
                recipient: context.game.activePlayer
            }))
        });
    }
}

Amberwind.id = 'æmberwind';

export default Amberwind;
