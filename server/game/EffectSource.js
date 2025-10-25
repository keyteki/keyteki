const _ = require('underscore');

const AbilityDsl = require('./abilitydsl.js');
const DelayedEffect = require('./DelayedEffect.js');
const GameObject = require('./GameObject');
const TerminalCondition = require('./TerminalCondition.js');

// This class is inherited by Ring and BaseCard and also represents Framework effects

class EffectSource extends GameObject {
    get name() {
        return 'Framework effect';
    }

    /**
     * Applies an immediate effect which lasts until the end of the phase.
     */
    untilPhaseEnd(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        return this.addEffectToEngine(
            Object.assign({ duration: 'untilPhaseEnd', location: 'any' }, properties)
        );
    }

    /**
     * Applies an immediate effect which lasts until the end of the turn.
     */
    untilPlayerTurnEnd(propertyFactory) {
        var properties = propertyFactory(AbilityDsl);
        return this.addEffectToEngine(
            Object.assign({ duration: 'untilPlayerTurnEnd', location: 'any' }, properties)
        );
    }

    untilPlayerNextTurnStart(propertyFactory) {
        let properties = propertyFactory(AbilityDsl);
        return this.addEffectToEngine(
            Object.assign({ duration: 'untilPlayerNextTurnStart', location: 'any' }, properties)
        );
    }

    /**
     * Applies a lasting effect which lasts until an event contained in the
     * `until` property for the effect has occurred.
     */
    lastingEffect(propertyFactory) {
        let properties = propertyFactory(AbilityDsl);
        return this.addEffectToEngine(
            Object.assign({ duration: 'custom', location: 'any' }, properties)
        );
    }

    /**
     * Applies a delayed effect
     */
    delayedEffect(propertyFactory) {
        let effect = new DelayedEffect(this.game, this, propertyFactory(AbilityDsl));
        this.game.effectEngine.addDelayedEffect(effect);
        return effect;
    }

    /**
     * Applies a terminal condition
     */
    terminalCondition(propertyFactory) {
        let effect = new TerminalCondition(this.game, this, propertyFactory(AbilityDsl));
        this.game.effectEngine.addTerminalCondition(effect);
        return effect;
    }

    /*
     * Adds a persistent/lasting/delayed effect to the effect engine
     * @param {Object} properties - properties for the effect - see Effects/Effect.js
     */
    addEffectToEngine(properties) {
        let effect = properties.effect;
        properties = _.omit(properties, 'effect');
        if (!Array.isArray(effect)) {
            effect = [effect];
        }

        return effect.map((factory) =>
            this.game.effectEngine.add(factory(this.game, this, properties))
        );
    }

    removeEffectFromEngine(effectArray) {
        this.game.effectEngine.unapplyAndRemove((effect) => effectArray.includes(effect));
    }

    removeLastingEffects() {
        this.game.effectEngine.removeLastingEffects(this);
    }
}

module.exports = EffectSource;
