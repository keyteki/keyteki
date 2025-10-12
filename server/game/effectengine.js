const _ = require('underscore');

const EventRegistrar = require('./eventregistrar.js');

class EffectEngine {
    constructor(game) {
        this.game = game;
        this.events = new EventRegistrar(game, this);
        this.events.register(['onPhaseEnded', 'onRoundEnded']);
        this.effects = [];
        this.delayedEffects = [];
        this.nextTurnEffects = [];
        this.terminalConditions = [];
        this.customDurationEvents = [];
        this.newEffect = false;
    }

    add(effect) {
        //console.log('add', effect.source.name, effect.effect.type, effect.targets.map(t => t.name), effect.match.name);
        if (['duringOpponentNextTurn'].includes(effect.duration)) {
            this.nextTurnEffects.push(effect);
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
        } else {
            this.checkEffects(stateChanged, loops + 1);
        }

        return stateChanged;
    }

    onPhaseEnded() {
        this.newEffect = this.unapplyAndRemove((effect) => effect.duration === 'untilEndOfPhase');
    }

    onRoundEnded() {
        // console.log('turn ended:', this.game.activePlayer.turn, this.game.activePlayer.name);
        // Remove current player's 'for remainder of turn' effects
        let effectsRemoved = this.unapplyAndRemove((effect) =>
            ['untilEndOfRound', 'forRemainderOfTurn'].includes(effect.duration)
        );

        // Remove 'until start of your next turn' effects for the player whose turn is starting
        effectsRemoved =
            this.unapplyAndRemove((effect) => {
                if (
                    effect.duration === 'untilNextTurn_waiting' &&
                    effect.effectController === this.game.activePlayer
                ) {
                    // console.log('effect removed:', this.game.activePlayer.name);
                }
                return (
                    effect.duration === 'untilNextTurn_waiting' &&
                    effect.effectController === this.game.activePlayer
                );
            }) || effectsRemoved;

        // Remove 'until end of your next turn' effects that are now ending
        effectsRemoved =
            this.unapplyAndRemove((effect) => {
                if (
                    effect.duration === 'untilEndOfMyNextTurn_waiting' &&
                    effect.effectController !== this.game.activePlayer
                ) {
                    // console.log('effect removed:', this.game.activePlayer.name);
                }
                return (
                    effect.duration === 'untilEndOfMyNextTurn_waiting' &&
                    effect.effectController !== this.game.activePlayer
                );
            }) || effectsRemoved;

        // Check if current player or opponent is taking next turn
        // let filterEndOfNextTurn = 'untilEndOfMyNextTurn';
        // if (this.game.activePlayer.opponent && !this.game.activePlayer.anyEffect('anotherTurn')) {
        //     filterEndOfNextTurn = 'nextRoundEffect';
        // }

        // Handle untilEndOfMyNextTurn effects - state machine approach
        this.effects.forEach((effect) => {
            // Standard untilNextTurn effects
            if (effect.duration === 'untilNextTurn') {
                effect.duration = 'untilNextTurn_waiting';
                // console.log(
                //     `untilNextTurn effect set to waiting:
                //     effect controller: ${effect.effectController}
                //     context player: ${effect.context.player.name}
                //     active player: ${this.game.activePlayer.name}
                //     `
                // );
            }

            // untilEndOfMyNextTurn state machine
            if (effect.duration === 'untilEndOfMyNextTurn') {
                // First transition: mark as waiting for my next turn
                effect.duration = 'untilEndOfMyNextTurn_waiting';
                // console.log('effect set to waiting:', this.game.activePlayer.name);
                // } else if (
                //     effect.duration === 'untilEndOfMyNextTurn_waiting' &&
                //     effect.effectController !== this.game.activePlayer
                // ) {
                //     // My turn is starting - mark as active (will be removed at end of this turn)
                //     effect.duration = 'untilEndOfMyNextTurn_active';
            }
        });

        this.newEffect = effectsRemoved;

        // Activate 'duringOpponentNextTurn' effects when switching to opponent
        if (this.game.activePlayer.opponent && !this.game.activePlayer.anyEffect('anotherTurn')) {
            this.nextTurnEffects = this.nextTurnEffects.filter((effect) => {
                if (
                    effect.duration === 'duringOpponentNextTurn' &&
                    this.game.activePlayer !== effect.effectController
                ) {
                    // Change duration to 'forRemainderOfTurn' and activate
                    effect.duration = 'forRemainderOfTurn';
                    this.add(effect);
                    return false; // Remove from nextTurnEffects
                }
                return true; // Keep in nextTurnEffects
            });
        }

        // TODO: what need to be done to add effects and set next turn effects?
        // eg duringOpponentNextTurn

        // Set next player's effects
        // this.nextTurnEffects = this.nextTurnEffects.filter((effect) => {
        //     if (effect.roundDuration > 1) {
        //         effect.roundDuration -= 1;
        //     }
        // });

        // _.each(this.nextTurnEffects, (effect) => {
        //     if (effect.roundDuration > 1) {
        //         // Check if we should wait for opponent turn
        //         let shouldActivate = true;
        //         if (effect.waitForOpponentTurn && effect.effectController) {
        //             // Only activate if it's now the opponent's turn
        //             shouldActivate = this.game.activePlayer !== effect.effectController;
        //         }

        //         if (shouldActivate) {
        //             effect.nextTurn = false;
        //             effect.roundDuration -= 1;
        //             this.add(effect);
        //         } else {
        //             // The effect stays in nextTurnEffects for another turn
        //         }
        //     }
        // });

        // // Only remove effects that were activated
        // this.nextTurnEffects = this.nextTurnEffects.filter((effect) => {
        //     if (effect.roundDuration > 1) {
        //         if (effect.waitForOpponentTurn && effect.effectController) {
        //             return this.game.activePlayer === effect.effectController;
        //         }
        //     }
        //     return false;
        // });

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
            //console.log('unapplyAndRemove', effect.source.name, effect.effect.type, effect.targets.map(t => t.name), effect.match.name);
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
