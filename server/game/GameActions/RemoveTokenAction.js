const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class RemoveTokenAction extends CardGameAction {
    constructor(propertyFactory, type = 'power') {
        super(propertyFactory);
        this.type = type;
    }

    setDefaultProperties() {
        this.amount = 1;
        this.all = false;
    }

    setup() {
        this.name = 'removeToken';
        this.targetType = ['artifact', 'creature', 'upgrade'];

        let type = this.type === 'power' ? 'power counter' : this.type;
        if (!this.all && this.amount > 1) {
            type += 's';
        }

        this.effectMsg = `remove ${this.all ? 'all' : this.amount} ${type} from {0}`;
    }

    getAmount(card) {
        let tokenCount = card.tokens[this.type] || 0;
        return this.all ? tokenCount : Math.min(tokenCount, this.amount);
    }

    checkEventCondition(event) {
        return !!event.card.tokens[event.type] && super.checkEventCondition(event);
    }

    canAffect(card, context) {
        return (
            (this.all || this.amount > 0) &&
            card.location === 'play area' &&
            super.canAffect(card, context)
        );
    }

    getEvent(card, context) {
        return super.createEvent(
            EVENTS.onRemoveToken,
            {
                type: this.type,
                card: card,
                context: context,
                amount: this.getAmount(card)
            },
            (event) => {
                if (this.upTo && event.amount > 0) {
                    context.game.promptWithHandlerMenu(context.player, {
                        activePromptTitle: 'Choose how many to remove',
                        context: context,
                        choices: Array.from(Array(event.amount + 1), (x, i) => i.toString()),
                        choiceHandler: (choice) => {
                            event.amount = parseInt(choice);
                            context.game.addMessage(
                                "{0} removes {1} tokens {2} using {3}'s ability",
                                context.player,
                                event.card,
                                choice,
                                context.source
                            );
                            card.removeToken(event.type, event.amount);
                        }
                    });
                } else {
                    card.removeToken(event.type, event.amount);
                }
            }
        );
    }
}

module.exports = RemoveTokenAction;
