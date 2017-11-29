const _ = require('underscore');

const EventRegistrar = require('./eventregistrar.js');

class EffectEngine {
    constructor(game) {
        this.game = game;
        this.events = new EventRegistrar(game, this);
        this.events.register(['onCardMoved', 'onCardTraitChanged', 'onCardFactionChanged', 'onCardTakenControl', 'onCardBlankToggled', 'onConflictFinished', 'onAtEndOfConflict', 'onPhaseEnded', 'onAtEndOfPhase', 'onRoundEnded', 'onDuelFinished']);
        this.effects = [];
        this.recalculateEvents = {};
        this.customDurationEvents = [];
    }

    add(effect) {
        if(!effect.isInActiveLocation()) {
            return;
        }

        this.effects.push(effect);
        this.effects = _.sortBy(this.effects, effect => effect.order);
        effect.addTargets(this.getTargets());
        this.registerRecalculateEvents(effect.recalculateWhen);
        if(effect.duration === 'custom') {
            this.registerCustomDurationEvents(effect);
        }
    }

    getTargets() {
        var validTargets = this.game.allCards.filter(card => ['province 1', 'province 2', 'province 3', 'province 4', 'stronghold province', 'play area', 'hand'].includes(card.location));
        return validTargets.concat(_.values(this.game.getPlayers()));
    }

    reapplyStateDependentEffects() {
        _.each(this.effects, effect => {
            if(effect.isStateDependent) {
                effect.reapply(this.getTargets());
            }
        });
    }

    onCardMoved(event) {
        let newArea = event.newLocation === 'hand' ? 'hand' : 'play area';
        this.removeTargetFromEffects(event.card, event.originalLocation);
        this.unapplyAndRemove(effect => effect.duration === 'persistent' && effect.source === event.card && (effect.location === event.originalLocation || event.parentChanged));
        this.addTargetForPersistentEffects(event.card, newArea);
    }

    onCardTakenControl(event) {
        let card = event.card;
        _.each(this.effects, effect => {
            if(effect.duration === 'persistent' && effect.source === card) {
                // Since the controllers have changed, explicitly cancel the
                // effect for existing targets and then recalculate effects for
                // the new controller from scratch.
                effect.cancel();
                effect.addTargets(this.getTargets());
            } else if(effect.duration === 'persistent' && effect.hasTarget(card) && !effect.isValidTarget(card)) {
                // Evict the card from any effects applied on it that are no
                // longer valid under the new controller.
                effect.removeTarget(card);
            }
        });

        // Reapply all relevant persistent effects given the card's new
        // controller.
        this.addTargetForPersistentEffects(card, 'play area');
    }

    onCardTraitChanged(event) {
        this.recalculateTargetingChange(event.card);
    }

    onCardFactionChanged(event) {
        this.recalculateTargetingChange(event.card);
    }

    recalculateTargetingChange(card) {
        _.each(this.effects, effect => {
            if(effect.duration === 'persistent' && effect.hasTarget(card) && !effect.isValidTarget(card)) {
                effect.removeTarget(card);
            }
        });

        this.addTargetForPersistentEffects(card, 'play area');
    }

    addTargetForPersistentEffects(card, targetLocation) {
        _.each(this.effects, effect => {
            if(effect.duration === 'persistent' && effect.targetLocation === targetLocation) {
                effect.addTargets([card]);
            }
        });
    }

    removeTargetFromEffects(card, location) {
        let area = location === 'hand' ? 'hand' : 'play area';
        _.each(this.effects, effect => {
            if(effect.targetLocation === area && effect.location !== 'any' || location === 'play area' && effect.duration !== 'persistent') {
                effect.removeTarget(card);
            }
        });
    }

    onCardBlankToggled(event) {
        let {card, isBlank} = event;
        let targets = this.getTargets();
        let matchingEffects = _.filter(this.effects, effect => effect.duration === 'persistent' && effect.source === card);
        _.each(matchingEffects, effect => {
            effect.setActive(!isBlank, targets);
        });
    }

    onConflictFinished() {
        this.unapplyAndRemove(effect => effect.duration === 'untilEndOfConflict');
    }

    onDuelFinished() {
        this.unapplyAndRemove(effect => effect.duration === 'untilEndOfDuel');
    }

    onAtEndOfConflict() {
        this.unapplyAndRemove(effect => effect.duration === 'atEndOfConflict');
    }

    onPhaseEnded() {
        this.unapplyAndRemove(effect => effect.duration === 'untilEndOfPhase');
    }

    onAtEndOfPhase() {
        this.unapplyAndRemove(effect => effect.duration === 'atEndOfPhase');
    }

    onRoundEnded() {
        this.unapplyAndRemove(effect => effect.duration === 'untilEndOfRound');
    }

    registerRecalculateEvents(eventNames) {
        _.each(eventNames, eventName => {
            if(!this.recalculateEvents[eventName]) {
                var handler = this.recalculateEvent.bind(this);
                this.recalculateEvents[eventName] = {
                    name: eventName,
                    handler: handler,
                    count: 1
                };
                this.game.on(eventName, handler);
            } else {
                this.recalculateEvents[eventName].count++;
            }
        });
    }

    unregisterRecalculateEvents(eventNames) {
        _.each(eventNames, eventName => {
            var event = this.recalculateEvents[eventName];
            if(event && event.count <= 1) {
                this.game.removeListener(event.name, event.handler);
                delete this.recalculateEvents[eventName];
            } else if(event) {
                event.count--;
            }
        });
    }

    recalculateEvent(event) {
        _.each(this.effects, effect => {
            if(effect.isStateDependent && effect.recalculateWhen.includes(event.name)) {
                effect.reapply(this.getTargets());
            }
        });
    }

    registerCustomDurationEvents(effect) {
        if(!effect.until) {
            return;
        }

        let eventNames = _.keys(effect.until);
        let handler = this.createCustomDurationHandler(effect);
        _.each(eventNames, eventName => {
            this.customDurationEvents.push({
                name: eventName,
                handler: handler,
                effect: effect
            });
            this.game.on(eventName, handler);
        });
    }

    unregisterCustomDurationEvents(effect) {
        let [eventsForEffect, remainingEvents] = _.partition(this.customDurationEvents, event => event.effect === effect);

        _.each(eventsForEffect, event => {
            this.game.removeListener(event.name, event.handler);
        });

        this.customDurationEvents = remainingEvents;
    }

    createCustomDurationHandler(customDurationEffect) {
        return (...args) => {
            let event = args[0];
            let listener = customDurationEffect.until[event.name];
            if(listener && listener(...args)) {
                customDurationEffect.cancel();
                this.unregisterRecalculateEvents(customDurationEffect.recalculateWhen);
                this.unregisterCustomDurationEvents(customDurationEffect);
                this.effects = _.reject(this.effects, effect => effect === customDurationEffect);
            }
        };
    }

    unapplyAndRemove(match) {
        var [matchingEffects, remainingEffects] = _.partition(this.effects, match);
        _.each(matchingEffects, effect => {
            effect.cancel();
            this.unregisterRecalculateEvents(effect.recalculateWhen);
        });
        this.effects = remainingEffects;
    }
}

module.exports = EffectEngine;
