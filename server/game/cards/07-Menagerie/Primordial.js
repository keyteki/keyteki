const Card = require('../../Card.js');

class Primordial extends Card {
    // Attach only to a friendly Legendary Keyraken. It gains, "After Reap: Draw 2 cards."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.draw({ amount: 2 })
            })
        });
    }

    canAttach(card, context) {
        return (
            card &&
            card.getType() === 'creature' &&
            card.location === 'play area' &&
            card.id === 'legendary-keyraken' &&
            card.controller === context.player
        );
    }
}

Primordial.id = 'primordial';

module.exports = Primordial;
