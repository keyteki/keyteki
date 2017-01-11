const _ = require('underscore');

const EventRegistrar = require('./eventregistrar.js');

class EffectEngine {
    constructor(game) {
        this.game = game;
        this.events = new EventRegistrar(game, this);
        this.events.register(['onCardEntersPlay', 'onCardLeftPlay', 'onCardBlankToggled']);
        this.effects = [];
    }

    add(effect) {
        this.effects.push(effect);
        this.applyEffect(effect);
    }

    applyEffect(effect) {
        var validTargets = this.game.allCards.filter(card => card.location === 'play area');
        effect.addTargets(validTargets);
    }

    reapplyStateDependentEffects() {
        _.each(this.effects, effect => {
            if(effect.isStateDependent) {
                effect.cancel();
                this.applyEffect(effect);
            }
        });
    }

    onCardEntersPlay(e, card) {
        _.each(this.effects, effect => {
            if(effect.duration === 'persistent') {
                effect.addTargets([card]);
            }
        });
    }

    onCardLeftPlay(e, player, card) {
        _.each(this.effects, effect => {
            effect.removeTarget(card);
        });

        this.unapplyAndRemove(effect => effect.duration === 'persistent' && effect.source === card);
    }

    onCardBlankToggled(event, card, isBlank) {
        var matchingEffects = _.filter(this.effects, effect => effect.duration === 'persistent' && effect.source === card);
        _.each(matchingEffects, effect => {
            effect.setActive(!isBlank);
        });
    }

    unapplyAndRemove(match) {
        var [matchingEffects, remainingEffects] = _.partition(this.effects, match);
        _.each(matchingEffects, effect => {
            effect.cancel();
        });
        this.effects = remainingEffects;
    }
}

module.exports = EffectEngine;
