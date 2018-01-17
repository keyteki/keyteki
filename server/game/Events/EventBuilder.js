const _ = require('underscore');

const Event = require('./Event');
const InitiateCardAbilityEvent = require('./InitiateCardAbilityEvent');
const LeavesPlayEvent = require('./LeavesPlayEvent');
const RemoveFateEvent = require('./RemoveFateEvent');

const NameToEvent = {
    default: (name, params, handler) => new Event(name, params, handler),
    onCardAbilityInitiated: (name, params, handler) => new InitiateCardAbilityEvent(params, handler),
    onCardLeavesPlay: (name, params) => new LeavesPlayEvent(params),
    onCardRemoveFate: (name, params) => new RemoveFateEvent(params)
};

const ActionToEvent = {
    honor: (card, context) => new Event('onCardHonored', { card: card, context: context, gameAction: 'honor' }, () => card.honor()),
    dishonor: (card, context) => new Event('onCardDishonored', { card: card, context: context, gameAction: 'dishonor' }, () => card.dishonor()),
    bow: (card, context) => new Event('onCardBowed', { card: card, context: context, gameAction: 'bow' }, () => card.bow()),
    ready: (card, context) => new Event('onCardReadied', { card: card, context: context, gameAction: 'ready' }, () => card.ready()),
    sendHome: (card, context) => new Event('onSendHome', { card: card, context: context, gameAction: 'sendHome' }, () => context.game.currentConflict.removeFromConflict(card)),
    moveToConflict: (card, context) => new Event('onMoveToConflict', { card: card, context: context, gameAction: 'moveToConflict' }, () => {
        if(card.controller.isAttackingPlayer()) {
            context.game.currentConflict.addAttacker(card);
        } else {
            context.game.currentConflict.addDefender(card);
        }
    }),
    removeFate: (card, context) => new RemoveFateEvent({ card: card, context: context, fate: 1 }),
    break: (card, context) => new Event('onBreakProvince', { province: card, conflict: context.game.currentConflict, context: context, gameAction: 'break' }, () => card.breakProvince()),
    discardFromPlay: (card, context) => new LeavesPlayEvent({ card: card, context: context, source: context.source }),
    returnToHand: (card, context) => new LeavesPlayEvent({ card: card, context: context, destination: 'hand' }),
    sacrifice: (card, context) => new LeavesPlayEvent({ card: card, context: context, isSacrifice: true }),
    takeControl: (card, context) => new Event('onCardTakenControl', { card: card, context: context, gameAction: 'takeControl' }, () => context.game.takeControl(context.player, card)),
    placeFate: (card, context) => new Event('onCardFateAdded', { card: card, context: context, gameAction: 'placeFate' }, () => card.fate++)
};

const ActionToConditionalEvents = {
    sendHome: cards => new Event('onSendCharactersHome', { cards: cards }),
    moveToConflict: cards => new Event('onSendCharactersHome', { cards: cards })
};

class EventBuilder {
    static for(name, params, handler) {
        let factory = NameToEvent.default;
        if(NameToEvent[name]) {
            factory = NameToEvent[name];
        }

        if(params.thenEvents) {
            let thenEvents = _.map(params.thenEvents, event => this.for(event.name, event.params, event.handler));
            let event = factory(name, _.omit(params, 'thenEvents'), handler);
            _.each(thenEvents, thenEvent => {
                thenEvent.parentEvent = event;
            });
            event.thenEvents = thenEvents;
            return event;   
        }

        return factory(name, params, handler);
    }

    static getEventsForAction(action, cards, context) {
        if(!_.isArray(cards)) {
            cards = [cards];
        }
        let events = _.map(cards, card => ActionToEvent[action](card, context));
        if(ActionToConditionalEvents[action]) {
            let conditionalEvent = ActionToConditionalEvents[action](cards);
            conditionalEvent.condition = () => _.any(events, event => !event.cancelled); 
            events.push(conditionalEvent);
        }
        return events;
    }
}

module.exports = EventBuilder;
