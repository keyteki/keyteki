const CannotRestriction = require('./Effects/Values/CannotRestriction');
const CanUse = require('./Effects/Values/CanUse');
const ConditionValue = require('./Effects/Values/ConditionValue');
const CopyCard = require('./Effects/Values/CopyCard');
const EffectBuilder = require('./Effects/EffectBuilder');
const EffectValue = require('./Effects/Values/EffectValue');
const GainAbility = require('./Effects/Values/GainAbility');

/* Types of effect
    1. Static effects - do something for a period
    2. Dynamic effects - like static, but what they do depends on the game state
    3. Detached effects - do something when applied, and on expiration, but can be ignored in the interim
*/

const Effects = {
    unblankableEffects: [
        'modifyPower',
        'setPower',
        'modifyArmor',
        'setArmor',
        'addTrait',
        'takeControl',
        'takeControlOn',
        'takeControlOnLeft',
        'takeControlOnRight',
        'changeType',
        'changeHouse',
        'addHouse',
        'addTrait',
        'flipToken',
        'copyCard',
        'mustFightIfAble',
        'blank'
    ],

    // Card effects
    actionCardLocationAfterPlay: (location) =>
        EffectBuilder.card.static('actionCardLocationAfterPlay', location),
    addHouse: (house) => EffectBuilder.card.static('addHouse', house),
    addKeyword: (keyword) => EffectBuilder.card.flexible('addKeyword', keyword),
    addTrait: (trait) => EffectBuilder.card.static('addTrait', trait),
    blank: () => EffectBuilder.card.static('blank'),
    blankFight: () => EffectBuilder.card.static('blankFight'),
    blankDestroyed: () => EffectBuilder.card.static('blankDestroyed'),
    bonusDamage: (bonus) => EffectBuilder.card.static('bonusDamage', bonus),
    bonusFightDamage: (match) => EffectBuilder.card.static('bonusFightDamage', match),
    canPlayAsUpgrade: () => EffectBuilder.card.static('canPlayAsUpgrade'),
    canAttachToArtifacts: () => EffectBuilder.card.static('canAttachToArtifacts'),
    cardCannot: (type, condition) =>
        EffectBuilder.card.static('abilityRestrictions', new CannotRestriction(type, condition)),
    changeHouse: (house) => EffectBuilder.card.static('changeHouse', house),
    changeType: (type) => EffectBuilder.card.static('changeType', type),
    consideredAsFlank: () => EffectBuilder.card.static('consideredAsFlank'),
    copyCard: (card, cascadeEffects = true) =>
        EffectBuilder.card.static('copyCard', new CopyCard(card, cascadeEffects)),
    customDetachedCard: (properties) => EffectBuilder.card.detached('customEffect', properties),
    doesNotReady: () => EffectBuilder.card.static('doesNotReady'),
    enterPlayAnywhere: () => EffectBuilder.card.static('enterPlayAnywhere'),
    entersPlayEnraged: (condition) =>
        EffectBuilder.card.static('entersPlayEnraged', new ConditionValue(condition)),
    entersPlayReady: (condition) =>
        EffectBuilder.card.static('entersPlayReady', new ConditionValue(condition)),
    entersPlayStunned: (condition) =>
        EffectBuilder.card.static('entersPlayStunned', new ConditionValue(condition)),
    entersPlayWithEffect: (properties) =>
        EffectBuilder.card.static('entersPlayWithEffect', new EffectValue(properties)),
    flipToken: () => EffectBuilder.card.static('flipToken'),
    visibleIn: (location) => EffectBuilder.card.static('visibleIn', location),
    gainAbility: (type, properties) =>
        EffectBuilder.card.static('gainAbility', new GainAbility(type, properties)),
    fightAbilitiesAddReap: () => EffectBuilder.card.static('fightAbilitiesAddReap'),
    ignores: (trait) => EffectBuilder.card.static('ignores', trait),
    keyAmber: () => EffectBuilder.card.static('keyAmber'),
    keyAmberOpponent: () => EffectBuilder.card.static('keyAmberOpponent'),
    isAmberInPool: () => EffectBuilder.card.static('isAmberInPool'),
    limitFightDamage: (amount) => EffectBuilder.card.flexible('limitFightDamage', amount),
    modifyArmor: (amount) => EffectBuilder.card.flexible('modifyArmor', amount),
    modifyBonusIcons: (icons) => EffectBuilder.card.flexible('modifyBonusIcons', icons),
    modifyPower: (amount) => EffectBuilder.card.flexible('modifyPower', amount),
    mustFightIfAble: () => EffectBuilder.card.static('mustFightIfAble'),
    playAbilitiesAddReap: () => EffectBuilder.card.static('playAbilitiesAddReap'),
    reapAbilitiesAddFight: () => EffectBuilder.card.static('reapAbilitiesAddFight'),
    removeAllTraits: () => EffectBuilder.card.static('removeAllTraits'),
    removeKeyword: (keyword) => EffectBuilder.card.static('removeKeyword', keyword),
    replaceDamage: (action, targetFunc) =>
        EffectBuilder.card.static('replaceDamage', { action, targetFunc }),
    resolveBonusIconsAdditionalTime: () =>
        EffectBuilder.card.static('resolveBonusIconsAdditionalTime'),
    returnToHandFromDiscardAnytime: () =>
        EffectBuilder.card.static('returnToHandFromDiscardAnytime'),
    setArmor: (amount) => EffectBuilder.card.flexible('setArmor', amount),
    setPower: (amount) => EffectBuilder.card.flexible('setPower', amount),
    takeControl: (player) => EffectBuilder.card.flexible('takeControl', player),
    takeControlOn: (position) => EffectBuilder.card.static('takeControlOn', position),
    takeControlOnLeft: () => EffectBuilder.card.static('takeControlOnLeft'),
    takeControlOnRight: () => EffectBuilder.card.static('takeControlOnRight'),
    entersPlayUnderOpponentsControl: () =>
        EffectBuilder.card.static('entersPlayUnderOpponentsControl'),
    terminalCondition: (properties) =>
        EffectBuilder.card.detached('terminalCondition', {
            apply: (card, context) => {
                properties.target = card;
                properties.context = properties.context || context;
                return context.source.terminalCondition(() => properties);
            },
            unapply: (card, context, effect) =>
                context.game.effectEngine.removeTerminalCondition(effect)
        }),
    transferDamage: (card) => EffectBuilder.card.static('transferDamage', card),
    // Player effects
    lastingAbilityTrigger: (properties) =>
        EffectBuilder.player.detached('abilityTrigger', {
            apply: (player, context) => {
                let ability = context.source.triggeredAbility(
                    properties.triggeredAbilityType || 'reaction',
                    Object.assign({ printedAbility: false, player: player }, properties)
                );
                ability.registerEvents();
                return ability;
            },
            unapply: (player, context, ability) => ability.unregisterEvents()
        }),
    additionalCost: (costFactory) => EffectBuilder.player.static('additionalCost', costFactory),
    anotherTurn: () => EffectBuilder.player.static('anotherTurn'),
    canFight: (match) => EffectBuilder.player.static('canUse', new CanUse(match, true)),
    canPlay: (match) => EffectBuilder.player.static('canPlay', match),
    canPlayFromOwn: (location) =>
        EffectBuilder.player.detached('canPlayFromOwn', {
            apply: (player) => player.addPlayableLocation('play', player, location),
            unapply: (player, context, location) => player.removePlayableLocation(location)
        }),
    canPlayHouse: (house) => EffectBuilder.player.flexible('canPlayHouse', house),
    canPlayNonHouse: (house) => EffectBuilder.player.flexible('canPlayNonHouse', house),
    canPlayOrUseHouse: (house) => EffectBuilder.player.static('canPlayOrUseHouse', house),
    canPlayOrUseNonHouse: (house) => EffectBuilder.player.static('canPlayOrUseNonHouse', house),
    canUseNonHouse: (house) => EffectBuilder.player.static('canUseNonHouse', house),
    canFightNonHouse: (house) => EffectBuilder.player.static('canFightNonHouse', house),
    canReapNonHouse: (house) => EffectBuilder.player.static('canReapNonHouse', house),
    canUseNonHouseCreature: (house) => EffectBuilder.player.static('canUseNonHouseCreature', house),
    canUse: (match) => EffectBuilder.player.static('canUse', new CanUse(match)),
    canUseHouse: (house) => EffectBuilder.player.static('canUseHouse', house),
    chooseCardsFromArchives: (card) => EffectBuilder.player.static('chooseCardsFromArchives', card),
    countPurgedForHaunted: () => EffectBuilder.player.static('countPurgedForHaunted'),
    customDetachedPlayer: (properties) => EffectBuilder.player.detached('customEffect', properties),
    delayedEffect: (properties) =>
        EffectBuilder.player.detached('delayedEffect', {
            apply: (player, context) => {
                properties.context = properties.context || context;
                return context.source.delayedEffect(() => properties);
            },
            unapply: (player, context, effect) =>
                context.game.effectEngine.removeDelayedEffect(effect)
        }),
    drawOneAtATimeDuringTurn: () => EffectBuilder.player.static('drawOneAtATimeDuringTurn'),
    mayResolveBonusIconsAs: (newIcon, icon = 'any') =>
        EffectBuilder.player.static('mayResolveBonusIconsAs', { newIcon: newIcon, icon: icon }),
    modifyKeyCost: (amount) => EffectBuilder.player.flexible('modifyKeyCost', amount),
    modifyHandSize: (amount) => EffectBuilder.player.flexible('modifyHandSize', amount),
    modifyTideCost: (amount) => EffectBuilder.player.flexible('modifyTideCost', amount),
    noActiveHouseForPlay: () => EffectBuilder.player.static('noActiveHouseForPlay'),
    playerCannot: (type, condition) =>
        EffectBuilder.player.static('abilityRestrictions', new CannotRestriction(type, condition)),
    restrictHouseChoice: (house) => EffectBuilder.player.static('restrictHouseChoice', house),
    stealFromPool: () => EffectBuilder.player.static('stealFromPool'),
    captureFromPool: () => EffectBuilder.player.static('captureFromPool'),
    stopHouseChoice: (house) => EffectBuilder.player.flexible('stopHouseChoice', house),
    skipStep: (step) => EffectBuilder.player.static('skipStep', step),
    opponentCardsCannotLeaveArchives: (card) =>
        EffectBuilder.player.static('opponentCardsCannotLeaveArchives', card),
    topCardOfDeckVisible: (card) => EffectBuilder.player.static('topCardOfDeckVisible', card),
    cannotPlayCreaturesOnRight: () => EffectBuilder.player.static('cannotPlayCreaturesOnRight'),
    canForgeSecondKeyDuringKeyPhase: () =>
        EffectBuilder.player.static('canForgeSecondKeyDuringKeyPhase'),
    cannotForgeMoreThan2KeysInATurn: () =>
        EffectBuilder.player.static('cannotForgeMoreThan2KeysInATurn'),
    redirectForgeAmber: () => EffectBuilder.player.static('redirectForgeAmber')
};

module.exports = Effects;
