const Card = require('../../Card.js');

class TechivorePulpate extends Card {
    // After a player chooses an active house, destroy each artifact of that house.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChooseActiveHouse: (event, context) =>
                    event.player === context.player || event.player !== context.player
            },
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.cardsInPlay.filter(
                    (card) => card.hasHouse(context.event.house) && card.type === 'artifact'
                )
            }))
        });
    }
}

TechivorePulpate.id = 'techivore-pulpate';

module.exports = TechivorePulpate;
