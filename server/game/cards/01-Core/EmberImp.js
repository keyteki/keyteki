import Card from '../../Card.js';

class EmberImp extends Card {
    // Your opponent cannot play more than 2 cards each turn.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.cardsPlayed.length > 1,
            targetController: 'opponent',
            effect: ability.effects.playerCannot('play')
        });
    }
}

EmberImp.id = 'ember-imp';

export default EmberImp;
