const Card = require('../../Card.js');

class CurseOfForgery extends Card {
    // Treachery. (This card enters play under your opponent's control.)
    // When you would forge a key, purge Curse of Forgery and do not forge that key (no amber is spent).
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onForgeKey: (event, context) =>
                    context.source.controller === context.game.activePlayer
            },
            effect: 'purge {0} and skip the Forge Key step',
            gameAction: [
                ability.actions.purge((context) => ({
                    target: context.source
                })),
                ability.actions.changeEvent((context) => ({
                    event: context.event,
                    cancel: true
                }))
            ]
        });
    }
}

CurseOfForgery.id = 'curse-of-forgery';

module.exports = CurseOfForgery;
