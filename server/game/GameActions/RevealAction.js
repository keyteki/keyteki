const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class RevealAction extends CardGameAction {
    setDefaultProperties() {
        this.chatMessage = false;
        this.location = ['hand'];
    }

    setup() {
        super.setup();
        this.name = 'reveal';
        this.effectMsg = 'reveal {0}';

        if (!Array.isArray(this.location)) {
            this.location = [this.location];
        }
    }

    canAffect(card, context) {
        return this.location.includes(card.location) && super.canAffect(card, context);
    }

    getEventArray(context) {
        const targets = this.target.filter((target) => this.canAffect(target, context));

        // Group cards by (location, controller) so we can emit one chat line
        // per zone listing all cards revealed from it, instead of one per
        // card. The first event in each group is tagged as the chat emitter
        // and prints the full group's card list during resolution.
        const groups = new Map();
        for (const card of targets) {
            const key = `${card.location}|${card.controller ? card.controller.uuid : ''}`;
            if (!groups.has(key)) {
                groups.set(key, []);
            }
            groups.get(key).push(card);
        }

        return targets.map((card) => {
            const key = `${card.location}|${card.controller ? card.controller.uuid : ''}`;
            const group = groups.get(key);
            const groupCards = group[0] === card ? group : null;
            return this.getEvent(card, context, groupCards);
        });
    }

    getEvent(card, context, groupCards = null) {
        return super.createEvent(EVENTS.onRevealCards, { card, context }, () => {
            if (this.chatMessage && groupCards) {
                if (card.location === 'hand' && card.controller) {
                    context.game.addMessage(
                        "{0} reveals {1} from {2}'s hand",
                        context.source,
                        groupCards,
                        card.controller
                    );
                } else {
                    context.game.addMessage('{0} reveals {1}', context.source, groupCards);
                }
            }
        });
    }
}

module.exports = RevealAction;
