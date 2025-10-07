import Card from '../../Card.js';

class RmFoler extends Card {
    // After Reap: Destroy an enemy creature. If you do, draw a card.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.destroy()
            },
            then: {
                gameAction: ability.actions.draw()
            }
        });
    }
}

RmFoler.id = 'rm-foler';

export default RmFoler;
