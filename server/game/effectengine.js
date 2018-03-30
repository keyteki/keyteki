const _ = require('underscore');

const EventRegistrar = require('./eventregistrar.js');

class EffectEngine {
    constructor(game) {
        this.game = game;
        this.events = new EventRegistrar(game, this);
        this.events.register(['onCardMoved', 'onCardBlankToggled', 'onCardTakenControl', 'onConflictFinished', 'onPhaseEnded', 'onRoundEnded', 'onDuelFinished']);
        this.effects = [];
        this.delayedEffects = [];
        this.customDurationEvents = [];
        this.newEffect = false;
    }

    add(effect) {
        if(!effect.isInActiveLocation()) {
            return;
        }

        this.effects.push(effect);
        this.effects = _.sortBy(this.effects, effect => effect.order);
        effect.getTargets();
        if(effect.duration === 'custom') {
            this.registerCustomDurationEvents(effect);
        }
        this.newEffect = true;
    }

    addDelayedEffect(effect) {
        this.delayedEffects.push(effect);
    }

    removeDelayedEffect(effect) {
        this.delayedEffects = _.reject(this.delayedEffects, e => e === effect);
    }

    checkDelayedEffects(events) {
        _.each(this.delayedEffects, effect => {
            if(effect.checkEffect(events)) {
                effect.executeHandler();
            }
        });
    }

    checkEffects(hasChanged = false) {
        if(!hasChanged && !this.newEffect) {
            return false;
        }
        let returnValue = this.newEffect;
        _.each(this.effects, effect => {
            // Check each effect's condition and find new targets
            // Reapply all effects which have reapply function
            this.newEffect = effect.checkCondition() || effect.reapply();
        });
        returnValue = returnValue || this.newEffect;
        this.reapplyOtherEffects();
        this.checkEffects();
        return returnValue;
    }

    reapplyOtherEffects() {
        _.each(this.effects, effect => {
            if(effect.reapplyOnCheckState) {
                effect.unapplyThenApply();
            }
        });
    }

    onCardMoved(event) {
        let newArea = event.newLocation === 'hand' ? 'hand' : 'play area';
        this.removeTargetFromEffects(event.card, event.originalLocation);
        this.unapplyAndRemove(effect => effect.duration === 'persistent' && effect.source === event.card && (effect.location === event.originalLocation || event.parentChanged));
        // Any lasting or delayed effects on this card should be removed when it leaves play
        this.unapplyAndRemove(effect => effect.match === event.card && effect.location !== 'any' && effect.duration !== 'persistent');
        this.delayedEffects = _.reject(this.delayedEffects, effect => effect.target === event.card);
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
                effect.getTargets();
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
            if(effect.duration === 'persistent' && effect.targetLocation === targetLocation && (_.isFunction(effect.match) || effect.match === card)) {
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
        let matchingEffects = _.filter(this.effects, effect => effect.duration === 'persistent' && effect.source === card);
        _.each(matchingEffects, effect => {
            effect.setActive(!isBlank);
        });
    }

    onConflictFinished() {
        this.newEffect = this.unapplyAndRemove(effect => effect.duration === 'untilEndOfConflict');
    }

    onDuelFinished() {
        this.newEffect = this.unapplyAndRemove(effect => effect.duration === 'untilEndOfDuel');
    }

    onPhaseEnded() {
        this.newEffect = this.unapplyAndRemove(effect => effect.duration === 'untilEndOfPhase');
    }

    onRoundEnded() {
        this.newEffect = this.unapplyAndRemove(effect => effect.duration === 'untilEndOfRound');
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
                this.unregisterCustomDurationEvents(customDurationEffect);
                this.effects = _.reject(this.effects, effect => effect === customDurationEffect);
            }
        };
    }

    unapplyAndRemove(match) {
        var [matchingEffects, remainingEffects] = _.partition(this.effects, match);
        _.each(matchingEffects, effect => {
            effect.cancel();
            if(effect.duration === 'custom') {
                this.unregisterCustomDurationEvents(effect);
            }
        });
        this.effects = remainingEffects;
        return matchingEffects.length > 0;
    }
}

module.exports = EffectEngine;
