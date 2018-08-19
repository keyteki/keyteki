const Card = require('../../Card.js');

class LibraryAccess extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.forRemainderOfTurn(context => ({
                when: { onCardPlayed: event => event.player === context.player },
                gameAction: ability.actions.draw() // TODO Fix this!
            }))
        });
        /*
        this.play({
            gameAction: ability.actions.playerLastingEffect(context => ({
                effect: ability.effects.customDetachedPlayer({
                    apply: player => context.source.delayedEffect(ability => ({
                        target: player,
                        source: context.source,
                        context: context,
                        when: {
                            onCardPlayed: event => event.player === player
                        },
                        gameAction: ability.actions.draw(),
                        message: '{1} draws a card due to {0}',
                        multipleTrigger: true
                    })),
                    unapply: (player, context, effect) => context.game.effectEngine.removeDelayedEffect(effect)
                })
            }))
        });
        */
    }
}

LibraryAccess.id = 'library-access'; // This is a guess at what the id might be - please check it!!!

module.exports = LibraryAccess;
