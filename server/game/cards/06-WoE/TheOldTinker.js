import Card from '../../Card.js';

class TheOldTinker extends Card {
    // Reap: Discard a card from your hand. If you do, draw a card.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.discard()
            },
            then: {
                gameAction: ability.actions.draw()
            }
        });
    }
}

TheOldTinker.id = 'the-old-tinker';

export default TheOldTinker;
