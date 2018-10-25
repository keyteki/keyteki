const Card = require('../../Card.js');

class StrangeGizmo extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onForgeKey: (event, context) => event.player === context.player
            },
            effect: 'destroy each creature and artifact',
            gameAction: ability.actions.destroy(context => ({ target: context.game.cardsInPlay }))
        });
    }
}

StrangeGizmo.id = 'StrangeGizmo'; // This is a guess at what the id might be - please check it!!!

module.exports = StrangeGizmo;
