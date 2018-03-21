const _ = require('underscore');

/**
 * Represents a delayed card based effect applied to one or more targets.
 *
 * Properties:
 * match            - function that takes a card and context object and returns
 *                    a boolean about whether the passed card should have the
 *                    effect applied. Alternatively, a card can be passed as the
 *                    match property to match that single card.
 * condition        - function that returns a boolean determining whether the
 *                    effect can be applied. Use with cards that have a
 *                    condition that must be met before applying a persistent
 *                    effect (e.g. "when there are more Summer plots revealed
 *                    than Winter plots").
 * targetController - string that determines which player's cards are targeted.
 *                    Can be 'current' (default), 'opponent' or 'any'.
 * targetType       - string that determines whether cards or players are the
 *                    target for the effect. Can be 'card' (default) or 'player'
 * gameAction       - gameAction to apply to target
 * effectFunc       - a function
 * trigger
 */

class DelayedEffect {
    constructor(game, source, properties) {
        this.game = game;
        this.context = properties.context;
        this.source = source;
        this.match = properties.match || (() => true);
        this.condition = properties.condition || (() => true);
        this.targetController = properties.targetController || 'current';
        this.targetType = properties.targetType || 'card';
        this.gameAction = properties.gameAction;
        this.effectFunc = properties.effectFunc;
        this.message = properties.message;
        this.trigger = properties.trigger || [];
        this.events = [];
        if(!_.isArray(this.trigger)) {
            this.trigger = [this.trigger];
        }
    }

    getTargets() {
        if(!this.condition(this.context) || _.any(this.events, event => !event.cancelled)) {
            return;
        }

        if(!_.isFunction(this.match)) {
            this.resolveEffect([this.match]);
        } else if(this.targetType === 'player') {
            this.addTargets(_.values(this.game.getPlayers()));
        } else {
            this.addTargets(this.game.getTargetsForEffect(this.match));
        }
    }

    addTargets(targets) {
        if(!this.condition(this.context)) {
            return;
        }
        this.resolveEffect(_.filter(targets, target => this.isValidTarget(target)));
    }

    resolveEffect(targets) {
        if(targets.length === 0) {
            return;
        }
        if(this.message) {
            this.game.addMessage(this.message, targets, this.source);
        }
        this.events = this.gameAction ? this.game.getEventsForGameAction(this.gameAction, targets, this.context) : this.effectFunc(targets, this.context);
        if(this.game.currentEventWindow && this.trigger.length === 0) {
            // Terminal conditions share reaction windows with the effect which triggered them
            this.game.currentEventWindow.openThenEventWindow(this.events);
        } else {
            this.game.openEventWindow(this.events);
        }
    }

    isValidTarget(target) {
        if(!this.match(target, this.context)) {
            return false;
        }

        if(this.targetType === 'card') {
            if(this.targetController === 'current') {
                return target.controller === this.context.player;
            }

            if(this.targetController === 'opponent') {
                return target.controller !== this.context.player;
            }
        } else if(this.targetType === 'player') {
            if(this.targetController === 'current') {
                return target === this.context.player;
            }

            if(this.targetController === 'opponent') {
                return target !== this.context.player;
            }
        }

        return true;
    }
}

module.exports = DelayedEffect;
