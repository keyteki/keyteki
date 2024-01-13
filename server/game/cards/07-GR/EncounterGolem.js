const Card = require('../../Card.js');

class EncounterGolem extends Card {
    // After you play an action card, put that card on the bottom of
    // your deck from your discard pile.
    //
    // Destroyed: If you are haunted, archive Encounter Golem.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlaced: (event, context) =>
                    context.game.activePlayer === context.player &&
                    event.card.controller === context.player &&
                    event.card.type === 'action' &&
                    event.from === 'being played' &&
                    event.to === 'discard'
            },
            gameAction: ability.actions.returnToDeck((context) => ({
                target: context.event.card,
                bottom: true
            }))
        });

        this.destroyed({
            condition: (context) => context.source.controller.isHaunted(),
            gameAction: ability.actions.archive()
        });
    }
}

EncounterGolem.id = 'encounter-golem';

module.exports = EncounterGolem;
