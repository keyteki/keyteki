import Card from '../../Card.js';
import EventRegistrar from '../../eventregistrar.js';

class NirborFlamewing extends Card {
    // At the start of your turn, if Nirbor Flamewing is in your
    // discard pile, you may destroy a friendly creature. If you do,
    // put Nirbor Flamewing into play ready.
    //
    // Destroyed: Make a token creature.
    setupCardAbilities(ability) {
        this.leftPlaySinceStartOfRound = false;

        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onBeginRound', 'onCardLeavesPlay', 'onCardEntersPlay']);

        this.reaction({
            when: {
                onBeginRound: (_, context) => context.player === this.game.activePlayer
            },
            optional: true,
            location: 'discard',
            effectStyle: 'all',
            target: {
                activePromptTitle: 'Choose a creature',
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.destroy()
            },
            then: {
                message: '{0} uses {1} to put {1} into play ready',
                gameAction: ability.actions.putIntoPlay({
                    target: this,
                    ready: true
                })
            }
        });

        // If Nirbor enters the discard pile during the `onBeginRound`
        // window (e.g., because another Nirbor Flamewing destroyed it, or
        // General Order 24, or something else that destroys creatures at the
        // "start of your turn", we can loop it back into play again by
        // interrupting the `onFinalizeBeginRound` event.
        //
        // It gets to have one instance of its resurrection ability
        // each time it re-enters the discard pile. (So, for instance, you
        // shouldn't be able to pop a ward during `onBeginRound` and then
        // kill the same creature during `onFinalizeBeginRound` in order to
        // get resurrected.)  So each time it leaves play, it gets the ability,
        // and each time it re-enters play, it loses it again.
        this.interrupt({
            when: {
                onFinalizeBeginRound: (_, context) =>
                    context.player === this.game.activePlayer && this.leftPlaySinceStartOfRound
            },
            optional: true,
            location: 'discard',
            effectStyle: 'all',
            target: {
                activePromptTitle: 'Choose a creature',
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.destroy()
            },
            then: (preThenContext) => ({
                message: '{0} uses {1} to put {1} into play ready',
                gameAction: ability.actions.putIntoPlay({
                    target: this,
                    ready: true
                }),
                then: {
                    alwaysTriggers: true,
                    gameAction: ability.actions.changeEvent(() => ({
                        event: preThenContext.event,
                        somethingChanged: true
                    }))
                }
            })
        });

        this.destroyed({
            gameAction: ability.actions.makeTokenCreature()
        });
    }

    onBeginRound() {
        this.leftPlaySinceStartOfRound = false;
    }

    onCardLeavesPlay(event) {
        if (event.card === this) {
            this.leftPlaySinceStartOfRound = true;
        }
    }

    onCardEntersPlay(event) {
        if (event.card === this) {
            this.leftPlaySinceStartOfRound = false;
        }
    }
}

NirborFlamewing.id = 'nirbor-flamewing';

export default NirborFlamewing;
