const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class UseAction extends CardGameAction {
    setDefaultProperties() {
        this.ignoreHouse = true;
    }

    setup() {
        this.name = 'use';
        this.targetType = ['creature', 'artifact'];
        this.effectMsg = 'use {0}';
    }

    canAffect(card, context) {
        return card.location === 'play area' && super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent(
            EVENTS.unnamedEvent,
            {
                card: card,
                player: context.player,
                context: context,
                ignoreHouse: this.ignoreHouse
            },
            (event) => card.use(event.player, event.ignoreHouse)
        );
    }
}

module.exports = UseAction;
