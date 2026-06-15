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
        for (const effect of this.delayedEffects) {
            effect.checkEffect(events);
        }
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
        // Record a snapshot of each effect's current target set so we can detect
        // persistent effects whose target set is oscillating between passes
        // (the signature of an infinite loop between two card abilities).
        this.recordTargetSnapshots();
        if (loops === 10) {
            // Per the rules, an infinite loop is resolved by removing the
            // affected card from play to its owner's discard pile (it is not
            // considered destroyed). Detect the oscillating effect(s) and
            // discard their source(s) to settle game state.
            const removed = this.resolveInfiniteLoop();
            if (!removed) {
                throw new Error('EffectEngine.checkEffects looped 10 times');
            }
            this.newEffect = true;
            return true;
        } else {
            this.checkEffects(stateChanged, loops + 1);
        }

        return stateChanged;
    }

    recordTargetSnapshots() {
        for (const effect of this.effects) {
            if (effect.duration !== 'persistentEffect') {
                continue;
            }
            const snapshot = effect.targets
                .map((t) => (t && t.uuid) || '')
                .sort()
                .join('|');
            if (!effect._targetHistory) {
                effect._targetHistory = [];
            }
            effect._targetHistory.push(snapshot);
            if (effect._targetHistory.length > 4) {
                effect._targetHistory.shift();
            }
        }
    }

    resolveInfiniteLoop() {
        // An effect is "oscillating" if its target set in the last 4 passes
        // alternates between two distinct states (A, B, A, B).
        const oscillating = this.effects.filter((effect) => {
            const history = effect._targetHistory;
            if (!history || history.length < 4) {
                return false;
            }
            const [a, b, c, d] = history.slice(-4);
            return a !== b && a === c && b === d;
        });

        const sourcesToDiscard = new Set();
        for (const effect of oscillating) {
            const source = effect.source;
            if (source && source.location === 'play area' && source.owner) {
                sourcesToDiscard.add(source);
            }
        }

        if (sourcesToDiscard.size === 0) {
            return false;
        }

        for (const source of sourcesToDiscard) {
            this.game.addMessage(
                "{0} is removed from play and placed in its owner's discard pile to resolve an infinite loop",
                source
            );
            source.owner.moveCard(source, 'discard');
        }

        // Reset history so subsequent checks start fresh.
        for (const effect of this.effects) {
            effect._targetHistory = [];
        }
        return true;
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
        for (const effect of anotherTurnEffects.slice(0, 1)) {
            effect.duration = 'untilPlayerTurnEnd';
        }
        // Save the rest for consecutive turns
        for (const effect of anotherTurnEffects.slice(1)) {
            effect.duration = 'consecutiveTurn';
        }

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
        for (const effect of this.effects) {
            if (effect.duration === 'untilPlayerNextTurnEnd') {
                effect.duration = 'untilPlayerNextTurnEndInitiated';
            }

            if (effect.duration === 'untilPlayerNextTurnStart') {
                effect.duration = 'untilPlayerNextTurnStartInitiated';
            }
        }

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
        for (const eventName of eventNames) {
            this.customDurationEvents.push({
                name: eventName,
                handler: handler,
                effect: effect
            });
            this.game.on(eventName, handler);
        }
    }

    unregisterCustomDurationEvents(effect) {
        let eventsForEffect = this.customDurationEvents.filter((event) => event.effect === effect);

        for (const event of eventsForEffect) {
            //console.log('unregisterCustomDurationEvents', effect.source.name, effect.effect.type, effect.targets.map(t => t.name), effect.match.name);
            this.game.removeListener(event.name, event.handler);
        }

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
        for (const effect of matchingEffects) {
            //console.log('unapplyAndRemove', effect.source.name, effect.effect.type, effect.targets.map(t => t.name), effect.match.name);
            effect.cancel();
            if (effect.duration === 'custom') {
                this.unregisterCustomDurationEvents(effect);
            }
        }
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
