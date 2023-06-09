const Card = require('../../Card.js');

class StrangeGizmo extends Card {
    // After you forge a key, destroy each creature and artifact.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onForgeKey: (event, context) => event.player === context.player
            },
            effect: 'destroy each creature and artifact',
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.cardsInPlay
            }))
        });
    }
}

StrangeGizmo.id = 'strange-gizmo';

module.exports = StrangeGizmo;
