const Card = require('../../Card.js');

class SingingScythe extends Card {
    // While you are haunted, you may return Singing Scythe from your
    // discard pile to your hand.
    //
    // This creature gains “After Reap: If you are haunted, purge a card from
    // a discard pile.”
    setupCardAbilities(ability) {
        // Allow it to return to hand any time during the main phase:
        this.persistentEffect({
            condition: (context) => context.source.controller.isHaunted(),
            targetLocation: 'discard',
            location: 'discard',
            effect: ability.effects.returnToHandFromDiscardAnytime()
        });

        // Allow it to return to hand at the start or end of the draw
        // phase.  Technically it can also be returned at any point
        // during any phase of the turn, but this should give enough
        // choice.
        this.reaction({
            when: {
                onBeginRound: (event, context) =>
                    event.player === context.player && context.player.isHaunted(),
                onPhaseEnded: (event, context) =>
                    event.phase === 'draw' &&
                    this.game.activePlayer === context.player &&
                    context.player.isHaunted()
            },
            optional: true,
            location: 'discard',
            gameAction: ability.actions.returnToHand((context) => ({
                location: 'discard',
                target: context.source
            }))
        });

        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                condition: (context) => context.source.controller.isHaunted(),
                target: {
                    controller: 'any',
                    location: 'discard',
                    gameAction: ability.actions.purge()
                }
            })
        });
    }
}

SingingScythe.id = 'singing-scythe';

module.exports = SingingScythe;
