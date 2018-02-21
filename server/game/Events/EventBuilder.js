const _ = require('underscore');

const Event = require('./Event');
const InitiateCardAbilityEvent = require('./InitiateCardAbilityEvent');
const LeavesPlayEvent = require('./LeavesPlayEvent');
const EntersPlayEvent = require('./EntersPlayEvent');
const RemoveFateEvent = require('./RemoveFateEvent');

const NameToEvent = {
    default: (name, params, handler) => new Event(name, params, handler),
    onCardAbilityInitiated: (name, params, handler) => new InitiateCardAbilityEvent(params, handler),
    onCardLeavesPlay: (name, params) => new LeavesPlayEvent(params, params.card),
    onCardRemoveFate: (name, params) => new RemoveFateEvent(params),
    onCardEntersPlay: (name, params) => new EntersPlayEvent(params, params.card)
};

const ActionToEvent = {
    honor: card => new Event('onCardHonored', {}, () => card.honor()),
    dishonor: card => new Event('onCardDishonored', {}, () => card.dishonor()),
    bow: card => new Event('onCardBowed', {}, () => card.bow()),
    ready: card => new Event('onCardReadied', {}, () => card.ready()),
    sendHome: (card, context) => new Event('onSendHome', {}, () => context.game.currentConflict.removeFromConflict(card)),
    moveToConflict: (card, context) => new Event('onMoveToConflict', {}, () => {
        if(card.controller.isAttackingPlayer()) {
            context.game.currentConflict.addAttacker(card);
        } else {
            context.game.currentConflict.addDefender(card);
        }
    }),
    removeFate: () => new RemoveFateEvent({ fate: 1 }),
    break: (card, context) => new Event('onBreakProvince', { conflict: context.game.currentConflict }, () => card.breakProvince()),
    discardFromPlay: (card, context) => new LeavesPlayEvent({ source: context.source }, card),
    returnToHand: card => new LeavesPlayEvent({ destination: 'hand' }, card),
    sacrifice: card => new LeavesPlayEvent({ isSacrifice: true }, card),
    takeControl: (card, context) => new Event('onCardTakenControl', {}, () => context.game.takeControl(context.player, card)),
    placeFate: card => new Event('onCardFateAdded', {}, () => card.fate++),
    putIntoPlay: card => new EntersPlayEvent({}, card),
    putIntoConflict: card => new EntersPlayEvent({ intoConflict: true }, card)
};

const ActionToConditionalEvents = {
    sendHome: events => new Event('onSendCharactersHome', { sendHomeEvents: events }),
    moveToConflict: events => new Event('onMoveCharactersToConflict', { moveToConflictEvents: events })
};

class EventBuilder {
    static for(name, params, handler) {
        let factory = NameToEvent.default;
        if(NameToEvent[name]) {
            factory = NameToEvent[name];
        }
        return factory(name, params, handler);
    }

    static getEventsForAction(action, cards, context) {
        if(!_.isArray(cards)) {
            cards = [cards];
        }
        let events = _.map(cards, card => {
            let event = ActionToEvent[action](card, context);
            event.card = card;
            event.context = context;
            event.gameAction = action;
            return event;
        });
        if(ActionToConditionalEvents[action]) {
            let conditionalEvent = ActionToConditionalEvents[action](events);
            conditionalEvent.condition = () => _.any(events, event => !event.cancelled); 
            return events.concat([conditionalEvent]);
        }
        return events;
    }
}

module.exports = EventBuilder;
