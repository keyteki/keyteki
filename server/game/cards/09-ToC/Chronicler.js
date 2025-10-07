import Card from '../../Card.js';

class Chronicler extends Card {
    // After Reap: Archive the top card of your deck.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.archive((context) => ({
                target: context.player.deck.slice(0, 1)
            })),
            effect: 'archive the top card of their deck'
        });
    }
}

Chronicler.id = 'chronicler';

export default Chronicler;
