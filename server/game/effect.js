const _ = require('underscore');

const Effects = require('./effects.js');
const Player = require('./player.js');

const PlayAreaLocations = ['play area', 'active plot'];

/**
 * Represents a card based effect applied to one or more targets.
 *
 * Properties:
 * match            - function that takes a card and context object and returns
 *                    a boolean about whether the passed card should have the
 *                    effect applied. Alternatively, a card can be passed as the
 *                    match property to match that single card.
 * duration         - string representing how long the effect lasts.
 * condition        - function that returns a boolean determining whether the
 *                    effect can be applied. Use with cards that have a
 *                    condition that must be met before applying a persistent
 *                    effect (e.g. "when there are more Summer plots revealed
 *                    than Winter plots").
 * targetController - string that determines which player's cards are targeted.
 *                    Can be 'current' (default), 'opponent' or 'any'.
 * targetType       - string that determines whether cards or players are the
 *                    target for the effect. Can be 'card' (default) or 'player'
 * targetLocation   - string that determines the location of cards that can be
 *                    applied by the effect. Can be 'play area' (default) or
 *                    'hand'.
 * effect           - object representing the effect to be applied. If passed an
 *                    array instead of an object, it will apply / unapply all of
 *                    the sub objects in the array instead.
 * effect.apply     - function that takes a card and a context object and modifies
 *                    the card to apply the effect.
 * effect.unapply   - function that takes a card and a context object and modifies
 *                    the card to remove the previously applied effect.
 * recalculateWhen  - optional array of event names that indicate when an effect
 *                    should be recalculated by the engine.
 */
class Effect {
    constructor(game, source, properties) {
        this.game = game;
        this.source = source;
        this.match = properties.match || (() => true);
        this.duration = properties.duration;
        this.condition = properties.condition || (() => true);
        this.targetController = properties.targetController || 'current';
        this.targetType = properties.targetType || 'card';
        this.targetLocation = properties.targetLocation || 'play area';
        this.effect = this.buildEffect(properties.effect);
        this.targets = [];
        this.context = { game: game, source: source };
        this.active = true;
        this.recalculateWhen = properties.recalculateWhen || [];
        this.isConditional = !!properties.condition;
        this.isStateDependent = properties.condition || this.effect.isStateDependent;
    }

    buildEffect(effect) {
        if(_.isArray(effect)) {
            return Effects.all(effect);
        }

        return effect;
    }

    addTargets(targets) {
        if(!this.condition()) {
            return;
        }

        _.each(targets, target => {
            if(this.isValidTarget(target)) {
                this.targets.push(target);
                if(this.active) {
                    this.effect.apply(target, this.context);
                }
            }
        });
    }

    isValidTarget(target) {
        if(this.targetType === 'card') {
            if(this.targetLocation === 'play area' && !PlayAreaLocations.includes(target.location)) {
                return false;
            }

            if(this.targetLocation === 'hand' && target.location !== 'hand') {
                return false;
            }
        }

        if(!_.isFunction(this.match)) {
            return target === this.match;
        }

        if(this.targetType === 'card' && (target instanceof Player) || this.targetType === 'player' && !(target instanceof Player)) {
            return false;
        }

        if(!this.match(target, this.context)) {
            return false;
        }

        if(this.targets.includes(target)) {
            return false;
        }

        if(this.targetType === 'card') {
            if(this.targetController === 'current') {
                return target.controller === this.source.controller;
            }

            if(this.targetController === 'opponent') {
                return target.controller !== this.source.controller;
            }
        } else if(this.targetType === 'player') {
            if(this.targetController === 'current') {
                return target === this.source.controller;
            }

            if(this.targetController === 'opponent') {
                return target !== this.source.controller;
            }
        }

        return true;
    }

    removeTarget(card) {
        if(!_.contains(this.targets, card)) {
            return;
        }

        if(this.active) {
            this.effect.unapply(card, this.context);
        }

        this.targets = _.reject(this.targets, target => target === card);
    }

    hasTarget(card) {
        return this.targets.includes(card);
    }

    setActive(newActive) {
        if(this.active && !newActive) {
            _.each(this.targets, target => this.effect.unapply(target, this.context));
        }

        if(!this.active && newActive) {
            _.each(this.targets, target => this.effect.apply(target, this.context));
        }

        this.active = newActive;
    }

    cancel() {
        if(this.active) {
            _.each(this.targets, target => this.effect.unapply(target, this.context));
        }
        this.targets = [];
    }

    reapply(newTargets) {
        if(!this.active) {
            return;
        }

        if(this.isConditional) {
            this.cancel();
            this.addTargets(newTargets);
        } else if(this.effect.isStateDependent) {
            _.each(this.targets, target => {
                this.effect.unapply(target, this.context);
                this.effect.apply(target, this.context);
            });
        }
    }
}

module.exports = Effect;
