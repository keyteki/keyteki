const _ = require('underscore');

/**
 * Represents a card based effect applied to one or more targets.
 *
 * Properties:
 * match            - function that takes a card/player/ring and context object
 *                    and returns a boolean about whether the passed object should
 *                    have the effect applied. Alternatively, a card/player/ring can
 *                    be passed as the match property to match that single object.
 *                    Doesn't apply to conflict effects.
 * duration         - string representing how long the effect lasts.
 * condition        - function that returns a boolean determining whether the
 *                    effect can be applied. Use with cards that have a
 *                    condition that must be met before applying a persistent
 *                    effect (e.g. "during a conflict").
 * location         - location where the source of this effect needs to be for
 *                    the effect to be active. Defaults to 'play area'.
 * targetController - string that determines which player's cards are targeted.
 *                    Can be 'current' (default), 'opponent' or 'any'. For player
 *                    effects it determines which player(s) are affected.
 * targetLocation   - string that determines the location of cards that can be
 *                    applied by the effect. Can be 'play area' (default),
 *                    'province', or a specific location (e.g. 'stronghold province'
 *                    or 'hand'). This has no effect if a specific card is passed
 *                    to match.  Card effects only.
 * effect           - object representing the effect to be applied.
 */
class Effect {
    constructor(game, source, properties, effect) {
        this.game = game;
        this.source = source;
        this.match = properties.match || (() => true);
        this.duration = properties.duration;
        this.until = properties.until || {};
        this.condition = properties.condition || (() => true);
        this.location = properties.location || 'play area';
        this.effect = effect;
        this.targets = [];
        this.effect.context = this.context = { game: game, source: source };
    }

    isInActiveLocation() {
        return ['any', this.source.location].includes(this.location);
    }

    isValidTarget(target) { // eslint-disable-line no-unused-vars
        return true;
    }

    getDefaultTarget(context) { // eslint-disable-line no-unused-vars
        return null;
    }

    getTargets() {
        return [];
    }

    addTarget(target) {
        this.targets.push(target);
        this.effect.apply(target);
    }

    removeTarget(target) {
        this.removeTargets([target]);
    }

    removeTargets(targets) {
        targets.forEach(target => this.effect.unapply(target));
        this.targets = _.difference(this.targets, targets);
    }

    hasTarget(target) {
        return this.targets.includes(target);
    }

    cancel() {
        _.each(this.targets, target => this.effect.unapply(target));
        this.targets = [];
    }

    checkCondition(stateChanged) {
        if(!this.condition() || (this.duration === 'persistent' && this.source.isBlank())) {
            stateChanged = this.targets.length > 0 || stateChanged;
            this.cancel();
            return stateChanged;
        } else if(_.isFunction(this.match)) {
            // Get any targets which are no longer valid
            let invalidTargets = _.filter(this.targets, target => !this.match(target) || !this.isValidTarget(target));
            // Remove invalid targets
            this.removeTargets(invalidTargets);
            stateChanged = stateChanged || invalidTargets.length > 0;
            // Recalculate the effect for valid targets
            _.each(this.targets, target => stateChanged = this.effect.recalculate(target) || stateChanged);
            // Check for new targets
            let newTargets = _.filter(this.getTargets(), target => !this.targets.includes(target) && this.isValidTarget(target));
            // Apply the effect to new targets
            _.each(newTargets, target => this.addTarget(target));
            return stateChanged || newTargets.length > 0;
        } else if(this.targets.includes(this.match)) {
            if(!this.isValidTarget(this.match)) {
                this.cancel();
                return true;
            }
            return this.effect.recalculate(this.match) || stateChanged;
        } else if(!this.targets.includes(this.match) && this.isValidTarget(this.match)) {
            this.addTarget(this.match);
            return true;
        }
        return stateChanged;
    }

    getDebugInfo() {
        return {
            source: this.source.name,
            targets: _.map(this.targets, target => target.name),
            active: this.duration !== 'persistent' || !this.source.isBlank(),
            condition: this.condition(),
            effect: this.effect.getDebugInfo()
        };
    }
}

module.exports = Effect;
