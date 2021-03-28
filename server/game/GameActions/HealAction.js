const CardGameAction = require('./CardGameAction');

class HealAction extends CardGameAction {
    setDefaultProperties() {
        this.amount = 1;
        this.fully = false;
        this.upTo = false;
    }

    setup() {
        this.name = 'heal';
        this.targetType = ['creature'];
        this.effectMsg =
            'heal {0} ' +
            (this.fully ? 'fully' : 'for ' + (this.upTo ? 'up to ' : '') + this.amount + ' damage');
    }

    canAffect(card, context) {
        if (card.location !== 'play area' || this.amount === 0) {
            return false;
        }

        return super.canAffect(card, context);
    }

    checkEventCondition(event) {
        return event.card.hasToken('damage') && super.checkEventCondition(event);
    }

    getEvent(card, context) {
        let amount = Math.min(card.tokens.damage || 0, this.amount);
        return super.createEvent('onHeal', { amount, card, context }, (event) => {
            if (this.fully) {
                event.amount = card.tokens.damage;
                card.removeToken('damage');
            } else if (this.upTo && event.amount > 0) {
                context.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Choose how many damage to heal',
                    context: context,
                    choices: Array.from(Array(event.amount + 1), (x, i) => i.toString()),
                    choiceHandler: (choice) => {
                        event.amount = parseInt(choice);
                        context.game.addMessage(
                            "{0} heals {1} for {2} damage using {3}'s ability",
                            context.player,
                            event.card,
                            choice,
                            context.source
                        );
                        card.removeToken('damage', event.amount);
                    }
                });
            } else {
                card.removeToken('damage', event.amount);
            }
        });
    }
}

module.exports = HealAction;
