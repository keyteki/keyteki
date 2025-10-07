import Card from '../../Card.js';

class Sidekick extends Card {
    // Play: Choose a card in your hand and put it into play as a token creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.makeTokenCreature()
            },
            effect: 'put a card from their hand into play as a token creature'
        });
    }
}

Sidekick.id = 'sidekick';

export default Sidekick;
