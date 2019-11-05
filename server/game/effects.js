const CannotRestriction = require('./Effects/cannotrestriction.js');
const CopyCard = require('./Effects/CopyCard');
const EffectBuilder = require('./Effects/EffectBuilder');
const GainAbility = require('./Effects/GainAbility');

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
    copyCard: (card) => EffectBuilder.card.static('copyCard', new CopyCard(card)),
    customDetachedCard: (properties) => EffectBuilder.card.detached('customEffect', properties),
    doesNotReady: () => EffectBuilder.card.static('doesNotReady'),
    gainAbility: (type, properties) => EffectBuilder.card.static('gainAbility', new GainAbility(type, properties)),
    fightAbilitiesAddReap: () => EffectBuilder.card.static('fightAbilitiesAddReap'),
    ignores: (trait) => EffectBuilder.card.static('ignores', trait),
    limitFightDamage: (amount) => EffectBuilder.card.flexible('limitFightDamage', amount),
    modifyAmberValue: (amount) => EffectBuilder.card.flexible('modifyAmberValue', amount),
    modifyArmor: (amount) => EffectBuilder.card.flexible('modifyArmor', amount),
    modifyPower: (amount) => EffectBuilder.card.flexible('modifyPower', amount),
    playAbilitiesAddReap: () => EffectBuilder.card.static('playAbilitiesAddReap'),
    reapAbilitiesAddFight: () => EffectBuilder.card.static('reapAbilitiesAddFight'),
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
        match(context.source, context)
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
    canPlayOrUseNonHouse: (house) => EffectBuilder.player.static('canPlayOrUseNonHouse', house),
    canUse: (match) => EffectBuilder.player.static('canUse', context => match(context.source, context)),
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
