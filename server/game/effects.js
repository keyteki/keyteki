const _ = require('underscore');

const AbilityLimit = require('./abilitylimit.js');
const CannotRestriction = require('./cannotrestriction.js');
const EffectBuilder = require('./Effects/EffectBuilder');

/* Types of effect
    1. Static effects - do something for a period
    2. Dynamic effects - like static, but what they do depends on the game state
    3. Detached effects - do something when applied, and on expiration, but can be ignored in the interim
*/

const Effects = {
    // Card effects
    addFaction: (faction) => EffectBuilder.card.static('addFaction', faction),
    addKeyword: (keyword) => EffectBuilder.card.static('addKeyword', keyword),
    addTrait: (trait) => EffectBuilder.card.static('addTrait', trait),
    blank: () => EffectBuilder.card.static('blank'),
    cardCannot: (properties) => EffectBuilder.card.static('abilityRestrictions', new CannotRestriction(properties)),
    customDetachedCard: (properties) => EffectBuilder.card.detached('customEffect', properties),
    delayedEffect: (properties) => EffectBuilder.card.detached('delayedEffect', {
        apply: (card, context) => {
            properties.target = card;
            properties.context = properties.context || context;
            return context.source.delayedEffect(() => properties);
        },
        unapply: (card, context, effect) => context.game.effectEngine.removeDelayedEffect(effect)
    }),
    doesNotReady: () => EffectBuilder.card.static('doesNotReady'),
    gainAbility: (abilityType, properties) => EffectBuilder.card.detached('gainAbility', {
        apply: (card, context) => {
            let ability;
            if(abilityType === 'action') {
                ability = card.action(properties);
            } else {
                ability = card.triggeredAbility(abilityType, properties);
                ability.registerEvents();
            }
            if(context.source.grantedAbilityLimits) {
                if(context.source.grantedAbilityLimits[card.uuid]) {
                    ability.limit = context.source.grantedAbilityLimits[card.uuid];
                } else {
                    context.source.grantedAbilityLimits[card.uuid] = ability.limit;
                }
            }
            return ability;
        },
        unapply: (card, context, ability) => {
            if(abilityType === 'action') {
                card.abilities.actions = card.abilities.actions.filter(a => a !== ability);
            } else {
                card.abilities.reactions = card.abilities.reactions.filter(a => a !== ability);
                ability.unregisterEvents();
            }
        }
    }),
    takeControl: (player) => EffectBuilder.card.static('takeControl', player),
    terminalCondition: (properties) => EffectBuilder.card.detached('terminalCondition', {
        apply: (card, context) => {
            properties.target = card;
            properties.context = properties.context || context;
            return context.source.terminalCondition(() => properties);
        },
        unapply: (card, context, effect) => context.game.effectEngine.removeTerminalCondition(effect)
    }),
    // Player effects
    canPlayFromOwn: (location) => EffectBuilder.player.detached('canPlayFromOwn', {
        apply: (player) => player.addPlayableLocation('play', player, location),
        unapply: (player, context, location) => player.removePlayableLocation(location)
    }),
    customDetachedPlayer: (properties) => EffectBuilder.player.detached('customEffect', properties),
    playerCannot: (properties) => EffectBuilder.player.static('abilityRestrictions', new CannotRestriction(properties)),
    showTopConflictCard: () => EffectBuilder.player.static('showTopConflictCard')
};

module.exports = Effects;
