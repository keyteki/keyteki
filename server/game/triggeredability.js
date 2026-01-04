const _ = require('underscore');

const CardAbility = require('./CardAbility.js');
const TriggeredAbilityContext = require('./TriggeredAbilityContext.js');
const { EVENTS } = require('./Events/types.js');

/**
 * Represents a reaction/interrupt ability provided by card text.
 *
 * Properties:
 * when    - object whose keys are event names to listen to for the reaction and
 *           whose values are functions that return a boolean about whether to
 *           trigger the reaction when that event is fired. For example, to
 *           trigger only at the end of the challenge phase, you would do:
 *           when: {
 *               onPhaseEnd: event => event.phase === 'conflict'
 *           }
 *           Multiple events may be specified for cards that have multiple
 *           possible triggers for the same reaction.
 * title   - string which is displayed to the player to reference this ability
 * cost    - object or array of objects representing the cost required to be
 *           paid before the action will activate. See Costs.
 * target  - object giving properties for the target API
 * handler - function that will be executed if the player chooses 'Yes' when
 *           asked to trigger the reaction. If the reaction has more than one
 *           choice, use the choices sub object instead.
 * limit   - optional AbilityLimit object that represents the max number of uses
 *           for the reaction as well as when it resets.
 * max     - optional AbilityLimit object that represents the max number of
 *           times the ability by card title can be used. Contrast with `limit`
 *           which limits per individual card.
 * location - string or array of strings indicating the location the card should
 *            be in in order to activate the reaction. Defaults to 'play area'.
 */

class TriggeredAbility extends CardAbility {
    constructor(game, card, abilityType, properties) {
        super(game, card, properties);
        this.when = properties.when;
        this.title = properties.title;
        this.triggeredByOpponent = !!properties.triggeredByOpponent;
        this.useEventPlayer = !!properties.useEventPlayer;
        this.autoResolve = !!properties.autoResolve;
        this.abilityType = abilityType;
        this.optional = properties.optional;
        this.isLastingAbilityTrigger = !!properties.player;
        this.multipleTrigger = !!properties.multipleTrigger;
        if (properties.location === 'any') {
            this.registerEvents();
        }
    }

    eventHandler(event, window) {
        let player = this.properties.player || this.card.controller;
        if (
            this.useEventPlayer ||
            (!this.isLastingAbilityTrigger &&
                event.name === EVENTS.onCardPlayed &&
                this.card.type === 'action')
        ) {
            player = event.player;
        } else if (this.triggeredByOpponent) {
            player = player.opponent;
        }

        if (!player) {
            return;
        }

        let context = this.createContext(player, event);
        if (this.card.reactions.includes(this) || this.isLastingAbilityTrigger) {
            if (this.isTriggeredByEvent(event, context)) {
                if (this.meetsRequirements(context, []) === '') {
                    window.addChoice(context);
                } else if (
                    this.meetsRequirements(context, []) === 'condition' &&
                    this.properties.destroyed
                ) {
                    // For destroyed abilities, allow 'condition' failures to be added to choices because the condition might change based on the order of resolution.
                    // e.g., gain amber from one ability before forging a key with another.
                    // These are added as "deferred" choices that will be filtered later if the condition still fails after other abilities resolve.
                    window.addDeferredChoice(context);
                }
            }
        }
    }

    createContext(player = this.card.controller, event) {
        return new TriggeredAbilityContext({
            event: event,
            game: this.game,
            source: this.card,
            player: player,
            ability: this
        });
    }

    isTriggeredByEvent(event, context) {
        if (this.properties.condition && !this.properties.condition(context)) {
            return false;
        } else if (!this.when[event.name] || !this.when[event.name](event, context)) {
            return false;
        } else if (this.properties.play || this.properties.fight || this.properties.reap) {
            if (
                (event.name === EVENTS.onCardPlayed && !this.isPlay()) ||
                (event.name === EVENTS.onFight && !this.isFight()) ||
                (event.name === EVENTS.onReap && !this.isReap())
            ) {
                return false;
            }
        }

        return true;
    }

    isPlay() {
        return this.properties.play;
    }

    isFight() {
        let { play, fight, reap } = this.properties;
        reap = reap || (play && this.card.anyEffect('playAbilitiesAddReap'));
        return fight || (reap && this.card.anyEffect('reapAbilitiesAddFight'));
    }

    isReap() {
        let { play, fight, reap } = this.properties;
        return (
            reap ||
            (play && this.card.anyEffect('playAbilitiesAddReap')) ||
            (fight && this.card.anyEffect('fightAbilitiesAddReap'))
        );
    }

    registerEvents() {
        if (this.events) {
            return;
        }

        var eventNames = _.keys(this.when);
        this.events = [];
        _.each(eventNames, (eventName) => {
            var event = {
                name: eventName + ':' + this.abilityType,
                handler: (event, window) => this.eventHandler(event, window)
            };
            this.game.on(event.name, event.handler);
            this.events.push(event);
        });
    }

    unregisterEvents() {
        if (this.events) {
            _.each(this.events, (event) => {
                this.game.removeListener(event.name, event.handler);
            });
            this.events = null;
        }
    }
}

module.exports = TriggeredAbility;
