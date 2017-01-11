const _ = require('underscore');

/**
 * Represents a card based effect applied to one or more targets.
 *
 * Properties:
 * match            - function that takes a card and context object and returns
 *                    a boolean about whether the passed card should have the
 *                    effect applied.
 * duration         - string representing how long the effect lasts.
 * condition        - function that returns a boolean determining whether the
 *                    effect can be applied. Use with cards that have a
 *                    condition that must be met before applying a persistent
 *                    effect (e.g. "when there are more Summer plots revealed
 *                    than Winter plots").
 * targetController - string that determines which player's cards are targeted.
 *                    Can be 'current' (default), 'opponent' or 'any'.
 * effect.apply     - function that takes a card and a context object and modifies
 *                    the card to apply the effect.
 * effect.unapply   - function that takes a card and a context object and modifies
 *                    the card to remove the previously applied effect.
 */
class Effect {
    constructor(game, source, properties) {
        this.game = game;
        this.source = source;
        this.match = properties.match;
        this.duration = properties.duration;
        this.condition = properties.condition || (() => true);
        this.targetController = properties.targetController || 'current';
        this.effect = properties.effect;
        this.targets = [];
        this.context = { game: game, source: source };
        this.active = true;
        this.isStateDependent = properties.condition || properties.effect.isStateDependent;
    }

    addTargets(cards) {
        if(!this.condition()) {
            return;
        }

        _.each(cards, card => {
            if(this.isValidTarget(card)) {
                this.targets.push(card);
                if(this.active) {
                    this.effect.apply(card, this.context);
                }
            }
        });
    }

    isValidTarget(card) {
        if(!this.match(card, this.context)) {
            return false;
        }

        if(this.targetController === 'current') {
            return card.controller === this.source.controller;
        }

        if(this.targetController === 'opponent') {
            return card.controller !== this.source.controller;
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
}

module.exports = Effect;
