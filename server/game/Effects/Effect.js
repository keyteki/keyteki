/**
 * Represents a card based effect applied to one or more targets.
 *
 * Properties:
 * match            - function that takes a card/player and context object
 *                    and returns a boolean about whether the passed object should
 *                    have the effect applied. Alternatively, a card/player can
 *                    be passed as the match property to match that single object.
 * duration         - string representing how long the effect lasts.
 * condition        - function that returns a boolean determining whether the
 *                    effect can be applied. Use with cards that have a
 *                    condition that must be met before applying a persistent
 *                    effect (e.g. "during a conflict"). Arguments are the context
 *                    and this Effect instance.
 * location         - location where the source of this effect needs to be for
 *                    the effect to be active. Defaults to 'play area'.
 * targetController - string that determines which player's cards are targeted.
 *                    Can be 'current' (default), 'opponent' or 'any'. For player
 *                    effects it determines which player(s) are affected.
 * targetLocation   - string that determines the location of cards that are
 *                    candidates for the effect, or 'any' if all cards are valid.
 *                    This has no effect if a specific card is passed as `match`
 *                    (such as how CardLastingEffectAction creates Effects).
 *                    Card effects only.
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
        this.printedAbility = properties.printedAbility !== false;
        this.targets = [];
        this.effect = effect;
        this.effectController = properties.effectController;
        this.refreshContext(properties.context);
    }

    refreshContext(context) {
        this.context = context || this.game.getFrameworkContext(this.source.controller);
        this.context.source = this.source;
        this.effect.setContext(this.context);
    }

    // eslint-disable-next-line no-unused-vars
    isValidTarget(target) {
        return true;
    }

    // eslint-disable-next-line no-unused-vars
    getDefaultTarget(context) {
        return null;
    }

    getTargets() {
        return [];
    }

    addTarget(target) {
        this.targets.push(target);
        this.effect.duration = this.duration;
        this.effect.apply(target);
    }

    removeTarget(target) {
        this.removeTargets([target]);
    }

    removeTargets(targets) {
        for (const target of targets) {
            this.effect.unapply(target);
        }
        this.targets = this.targets.filter((x) => !targets.includes(x));
    }

    hasTarget(target) {
        return this.targets.includes(target);
    }

    cancel() {
        for (const target of this.targets) {
            this.effect.unapply(target);
        }
        this.targets = [];
    }

    isEffectActive() {
        if (this.duration !== 'persistentEffect') {
            return true;
        }

        let effectOnSource = this.source.persistentEffects.some(
            (effect) => effect.ref && effect.ref.includes(this)
        );
        return (this.location === 'any' || !this.source.facedown) && effectOnSource;
    }

    checkCondition(stateChanged) {
        if (!this.condition(this.context, this) || !this.isEffectActive()) {
            stateChanged = this.targets.length > 0 || stateChanged;
            this.cancel();
            return stateChanged;
        } else if (typeof this.match === 'function') {
            // Get any targets which are no longer valid
            let invalidTargets = this.targets.filter(
                (target) => !this.match(target, this.context) || !this.isValidTarget(target)
            );
            // Remove invalid targets
            this.removeTargets(invalidTargets);
            stateChanged = stateChanged || invalidTargets.length > 0;
            // Recalculate the effect for valid targets
            for (const target of this.targets) {
                stateChanged = this.effect.recalculate(target) || stateChanged;
            }
            // Check for new targets
            let newTargets = this.getTargets().filter(
                (target) => !this.targets.includes(target) && this.isValidTarget(target)
            );
            // Apply the effect to new targets
            for (const target of newTargets) {
                this.addTarget(target);
            }
            return stateChanged || newTargets.length > 0;
        } else if (this.targets.includes(this.match)) {
            if (!this.isValidTarget(this.match)) {
                this.cancel();
                return true;
            }

            return this.effect.recalculate(this.match) || stateChanged;
        } else if (!this.targets.includes(this.match) && this.isValidTarget(this.match)) {
            this.addTarget(this.match);
            return true;
        }

        return stateChanged;
    }

    getDebugInfo() {
        return {
            source: this.source.printedName,
            targets: this.targets.map((target) => target.name),
            active: this.duration !== 'persistentEffect' || !this.source.isBlank(),
            condition: this.condition(this.context, this),
            effect: this.effect.getDebugInfo()
        };
    }
}

module.exports = Effect;
