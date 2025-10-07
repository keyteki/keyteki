import CardGameAction from './CardGameAction.js';

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
            'unnamedEvent',
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

export default UseAction;
