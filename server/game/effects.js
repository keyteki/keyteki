const CannotRestriction = require('./cannotrestriction.js');
const EffectBuilder = require('./Effects/EffectBuilder');

/* Types of effect
    1. Static effects - do something for a period
    2. Dynamic effects - like static, but what they do depends on the game state
    3. Detached effects - do something when applied, and on expiration, but can be ignored in the interim
*/

const Effects = {
    // Card effects
    addHouse: (house) => EffectBuilder.card.static('addHouse', house),
    addKeyword: (keyword) => EffectBuilder.card.static('addKeyword', keyword),
    addTrait: (trait) => EffectBuilder.card.static('addTrait', trait),
    blank: () => EffectBuilder.card.static('blank'),
    bonusDamage: (match) => EffectBuilder.card.static('bonusDamage', match),
    canPlayAsUpgrade: () => EffectBuilder.card.static('canPlayAsUpgrade'),
    cardCannot: (type, condition) => EffectBuilder.card.static('abilityRestrictions', new CannotRestriction(type, condition)),
    changeHouse: (house) => EffectBuilder.card.static('changeHouse', house),
    changeType: (type) => EffectBuilder.card.static('changeType', type),
    consideredAsFlank: () => EffectBuilder.card.static('consideredAsFlank'),
    customDetachedCard: (properties) => EffectBuilder.card.detached('customEffect', properties),
    doesNotReady: () => EffectBuilder.card.static('doesNotReady'),
    limitFightDamage: (amount) => EffectBuilder.card.flexible('limitFightDamage', amount),
    gainAbility: (abilityType, properties) => EffectBuilder.card.detached('gainAbility', {
        apply: (card, context) => {
            let ability;
            properties.printedAbility = false;
            if(abilityType === 'action') {
                ability = card.action(properties);
            } else if(abilityType === 'persistentEffect') {
                ability = card.persistentEffect(properties);
                ability.ref = card.addEffectToEngine(ability);
            } else {
                if(['fight', 'reap', 'play', 'destroyed', 'beforeFight'].includes(abilityType)) {
                    ability = card[abilityType](properties);
                } else {
                    ability = card.triggeredAbility(abilityType, properties);
                }

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
            } else if(abilityType === 'persistentEffect') {
                card.abilities.persistentEffects = card.abilities.persistentEffects.filter(a => a !== ability);
                card.removeEffectFromEngine(ability.ref);
            } else {
                card.abilities.reactions = card.abilities.reactions.filter(a => a !== ability);
                ability.unregisterEvents();
            }
        }
    }),
    ignores: (trait) => EffectBuilder.card.static('ignores', trait),
    modifyAmberValue: (amount) => EffectBuilder.card.flexible('modifyAmberValue', amount),
    modifyArmor: (amount) => EffectBuilder.card.flexible('modifyArmor', amount),
    modifyPower: (amount) => EffectBuilder.card.flexible('modifyPower', amount),
    removeKeyword: (keyword) => EffectBuilder.card.static('removeKeyword', keyword),
    takeControl: (player) => EffectBuilder.card.static('takeControl', player),
    entersPlayUnderOpponentsControl: () => EffectBuilder.card.static('entersPlayUnderOpponentsControl'),
    terminalCondition: (properties) => EffectBuilder.card.detached('terminalCondition', {
        apply: (card, context) => {
            properties.target = card;
            properties.context = properties.context || context;
            return context.source.terminalCondition(() => properties);
        },
        unapply: (card, context, effect) => context.game.effectEngine.removeTerminalCondition(effect)
    }),
    transferDamage: (card) => EffectBuilder.card.static('transferDamage', card),
    // Player effects
    additionalCost: (costFactory) => EffectBuilder.player.static('additionalCost', costFactory),
    canFight: (match) => EffectBuilder.player.static('canUse', context => (
        (context.ability.title === 'Fight with this creature' ||
            context.ability.title === 'Remove this creature\'s stun') &&
        match(context.source)
    )),
    mustFightIfAble: () => EffectBuilder.card.static('mustFightIfAble'),
    canPlay: (match) => EffectBuilder.player.static('canPlay', match),
    canPlayFromOwn: (location) => EffectBuilder.player.detached('canPlayFromOwn', {
        apply: (player) => player.addPlayableLocation('play', player, location),
        unapply: (player, context, location) => player.removePlayableLocation(location)
    }),
    canPlayHouse: (house) => EffectBuilder.player.static('canPlayHouse', house),
    canPlayNonHouse: (house) => EffectBuilder.player.flexible('canPlayNonHouse', house),
    canPlayOrUseHouse: (house) => EffectBuilder.player.static('canPlayOrUseHouse', house),
    canUse: (match) => EffectBuilder.player.static('canUse', context => match(context.source)),
    canUseHouse: (house) => EffectBuilder.player.static('canUseHouse', house),
    customDetachedPlayer: (properties) => EffectBuilder.player.detached('customEffect', properties),
    delayedEffect: (properties) => EffectBuilder.player.detached('delayedEffect', {
        apply: (player, context) => {
            properties.context = properties.context || context;
            return context.source.delayedEffect(() => properties);
        },
        unapply: (player, context, effect) => context.game.effectEngine.removeDelayedEffect(effect)
    }),
    forgeAmberGainedByOpponent: () => EffectBuilder.player.static('forgeAmberGainedByOpponent'),
    keyAmber: (source) => EffectBuilder.player.static('keyAmber', source),
    modifyKeyCost: (amount) => EffectBuilder.player.flexible('modifyKeyCost', amount),
    modifyHandSize: (amount) => EffectBuilder.player.flexible('modifyHandSize', amount),
    noActiveHouseForPlay: () => EffectBuilder.player.static('noActiveHouseForPlay'),
    playerCannot: (type, condition) => EffectBuilder.player.static('abilityRestrictions', new CannotRestriction(type, condition)),
    redirectAmber: (recepient) => EffectBuilder.player.static('redirectAmber', recepient),
    restrictHouseChoice: (house) => EffectBuilder.player.static('restrictHouseChoice', house),
    stealFromPool: () => EffectBuilder.player.static('stealFromPool'),
    captureFromPool: () => EffectBuilder.player.static('captureFromPool'),
    stopHouseChoice: (house) => EffectBuilder.player.static('stopHouseChoice', house),
    skipStep: (step) => EffectBuilder.player.static('skipStep', step)
};

module.exports = Effects;
