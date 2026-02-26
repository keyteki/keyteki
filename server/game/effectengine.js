const _ = require('underscore');

const EventRegistrar = require('./eventregistrar.js');

class EffectEngine {
    constructor(game) {
        this.game = game;
        this.events = new EventRegistrar(game, this);
        this.events.register(['onPhaseEnd', 'onTurnEnd']);
        this.effects = [];
        this.delayedEffects = [];
        this.duringOpponentNextTurnEffects = [];
        this.terminalConditions = [];
        this.customDurationEvents = [];
        this.newEffect = false;
    }

    add(effect) {
        //console.log('add', effect.source.name, effect.effect.type, effect.targets.map(t => t.name), effect.match.name);
        if (['duringOpponentNextTurn'].includes(effect.duration)) {
            this.duringOpponentNextTurnEffects.push(effect);
        } else {
            this.effects.push(effect);
            if (effect.duration === 'custom') {
                this.registerCustomDurationEvents(effect);
            }
            this.newEffect = true;
        }

        return effect;
    }

    addTerminalCondition(effect) {
        this.terminalConditions.push(effect);
    }

    removeTerminalCondition(effect) {
        this.terminalConditions = this.terminalConditions.filter((e) => e !== effect);
    }

    addDelayedEffect(effect) {
        this.delayedEffects.push(effect);
    }

    removeDelayedEffect(effect) {
        this.delayedEffects = this.delayedEffects.filter((e) => e !== effect);
    }

    checkDelayedEffects(events) {
        this.delayedEffects = this.delayedEffects.filter(
            (effect) =>
                !effect.target ||
                effect.target.type === 'player' ||
                effect.target.location === 'play area'
        );
        _.each(this.delayedEffects, (effect) => effect.checkEffect(events));
    }

    checkTerminalConditions() {
        let effectsToTrigger = this.terminalConditions.filter((effect) => effect.checkCondition());
        if (effectsToTrigger.length > 0) {
            this.game.openEventWindow(effectsToTrigger.map((effect) => effect.getEvent()));
        }
    }

    removeLastingEffects(card) {
        this.unapplyAndRemove(
            (effect) => effect.match === card && effect.duration !== 'persistentEffect'
        );
    }

    checkEffects(prevStateChanged = false, loops = 0) {
        if (!prevStateChanged && !this.newEffect) {
            return false;
        }

        let stateChanged = false;
        this.newEffect = false;
        // Check each effect's condition and find new targets
        stateChanged = this.effects.reduce(
            (stateChanged, effect) => effect.checkCondition(stateChanged),
            stateChanged
        );
        if (loops === 10) {
            throw new Error('EffectEngine.checkEffects looped 10 times');
        } else if (stateChanged || this.newEffect) {
            // Only recurse if state actually changed or new effects were added
            this.checkEffects(stateChanged, loops + 1);
        }

        return stateChanged;
    }

    onPhaseEnd() {
        this.newEffect = this.unapplyAndRemove((effect) => effect.duration === 'untilPhaseEnd');
    }

    onTurnEnd() {
        // Check for another turn effects which are normally removed with 'for remainder of turn' effects
        const anotherTurnEffects = this.effects.filter(
            (effect) =>
                effect.effectController === this.game.activePlayer &&
                effect.effect.type === 'anotherTurn'
        );
        const anotherTurn = anotherTurnEffects.length > 0;

        // Let the first 'another turn' effect to be removed with 'for remainder of turn' effects
        anotherTurnEffects
            .slice(0, 1)
            .forEach((effect) => (effect.duration = 'untilPlayerTurnEnd'));
        // Save the rest for consecutive turns
        anotherTurnEffects.slice(1).forEach((effect) => (effect.duration = 'consecutiveTurn'));

        // Remove 'for remainder of turn' effects
        let effectsRemoved = this.unapplyAndRemove((effect) =>
            ['untilPlayerTurnEnd'].includes(effect.duration)
        );

        // Remove 'until end of your next turn' effects for the player whose turn is ending
        effectsRemoved =
            this.unapplyAndRemove(
                (effect) =>
                    effect.duration === 'untilPlayerNextTurnEndInitiated' &&
                    // At this point active player has switched, so check for the opposite player
                    effect.effectController !== this.game.activePlayer
            ) || effectsRemoved;

        // Remove 'until start of your next turn' effects for the player whose turn is starting
        effectsRemoved =
            this.unapplyAndRemove(
                (effect) =>
                    (effect.duration === 'untilPlayerNextTurnStartInitiated' &&
                        effect.effectController === this.game.activePlayer) ||
                    // When the active player takes another turn
                    (effect.duration === 'untilPlayerNextTurnStart' && anotherTurn)
            ) || effectsRemoved;

        // Label effects that were added this turn and should last until a future turn
        this.effects.forEach((effect) => {
            if (effect.duration === 'untilPlayerNextTurnEnd') {
                effect.duration = 'untilPlayerNextTurnEndInitiated';
            }

            if (effect.duration === 'untilPlayerNextTurnStart') {
                effect.duration = 'untilPlayerNextTurnStartInitiated';
            }
        });

        // Add 'during your opponent's next turn' effects when switching players
        this.duringOpponentNextTurnEffects = this.duringOpponentNextTurnEffects.filter((effect) => {
            if (
                effect.duration === 'duringOpponentNextTurn' &&
                this.game.activePlayer !== effect.effectController
            ) {
                // Change effect duration to 'untilPlayerTurnEnd'
                effect.duration = 'untilPlayerTurnEnd';
                // Add effect
                this.add(effect);
                return false; // Remove from duringOpponentNextTurnEffects
            }
            return true; // Keep in duringOpponentNextTurnEffects
        });

        this.newEffect = effectsRemoved;
    }

    registerCustomDurationEvents(effect) {
        if (!effect.until) {
            return;
        }

        let eventNames = Object.keys(effect.until);
        let handler = this.createCustomDurationHandler(effect);
        _.each(eventNames, (eventName) => {
            this.customDurationEvents.push({
                name: eventName,
                handler: handler,
                effect: effect
            });
            this.game.on(eventName, handler);
        });
    }

    unregisterCustomDurationEvents(effect) {
        let eventsForEffect = this.customDurationEvents.filter((event) => event.effect === effect);

        _.each(eventsForEffect, (event) => {
            //console.log('unregisterCustomDurationEvents', effect.source.name, effect.effect.type, effect.targets.map(t => t.name), effect.match.name);
            this.game.removeListener(event.name, event.handler);
        });

        this.customDurationEvents = this.customDurationEvents.filter(
            (event) => event.effect !== effect
        );
    }

    createCustomDurationHandler(customDurationEffect) {
        return (...args) => {
            let event = args[0];
            let listener = customDurationEffect.until[event.name];
            if (listener && listener(...args)) {
                customDurationEffect.cancel();
                this.unregisterCustomDurationEvents(customDurationEffect);
                this.effects = this.effects.filter((effect) => effect !== customDurationEffect);
            }
        };
    }

    unapplyAndRemove(match) {
        let matchingEffects = this.effects.filter(match);
        _.each(matchingEffects, (effect) => {
            effect.isRegistered = false;
            effect.cancel();
            if (effect.duration === 'custom') {
                this.unregisterCustomDurationEvents(effect);
            }
        });
        this.effects = this.effects.filter((effect) => !matchingEffects.includes(effect));
        return matchingEffects.length > 0;
    }

    getDebugInfo() {
        return {
            effects: this.effects.map((effect) => effect.getDebugInfo()),
            delayedEffects: this.delayedEffects.map((effect) => effect.getDebugInfo())
        };
    }
}

module.exports = EffectEngine;
