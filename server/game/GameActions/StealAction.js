const { EVENTS } = require('../Events/types');
const PlayerAction = require('./PlayerAction');

class StealAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = 'steal';
        this.effectMsg = 'steal ' + this.amount + ' amber from {0}';
    }

    canAffect(player, context) {
        if (!player.opponent || player.amber <= 0 || this.amount <= 0) {
            return false;
        }

        if (!player.checkRestrictions('steal', context)) {
            // Find and report which card(s) are preventing steal
            this.printPreventionMessage(player, context);
            return false;
        }

        return super.canAffect(player, context);
    }

    printPreventionMessage(player, context) {
        // Find effects that are preventing steal
        const preventingEffects = player.effects.filter(
            (effect) =>
                effect.type === 'abilityRestrictions' &&
                effect.getValue(player).checkRestriction('steal', context, null, effect.context)
        );

        for (const effect of preventingEffects) {
            const source = effect.context?.source;
            if (source) {
                context.game.addMessage(
                    '{0} uses {1} to prevent {2} from stealing amber',
                    player,
                    source,
                    context.player
                );
            }
        }
    }

    getEvent(player, context) {
        let params = {
            context: context,
            player: player,
            amount: Math.min(this.amount, player.amber)
        };
        return super.createEvent(EVENTS.onStealAmber, params, (event) => {
            if (!event.player.anyEffect('stealFromPool')) {
                event.player.modifyAmber(-event.amount);
            }

            context.game.actions
                .gainAmber({ amount: event.amount })
                .resolve(event.player.opponent, context);
        });
    }
}

module.exports = StealAction;
