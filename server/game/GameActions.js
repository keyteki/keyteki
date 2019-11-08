const GameActions = require('./GameActions/index');

const Actions = {
    // card actions
    addPowerCounter: (propertyFactory) => new GameActions.AddTokenAction(propertyFactory, 'power'),
    addDamageToken: (propertyFactory) => new GameActions.AddTokenAction(propertyFactory, 'damage'),
    addDisruptionCounter: (propertyFactory) => new GameActions.AddTokenAction(propertyFactory, 'disruption'),
    addDoomCounter: (propertyFactory) => new GameActions.AddTokenAction(propertyFactory, 'doom'),
    addFuseCounter: (propertyFactory) => new GameActions.AddTokenAction(propertyFactory, 'fuse'),
    addGloryCounter: (propertyFactory) => new GameActions.AddTokenAction(propertyFactory, 'glory'),
    addGrowthCounter: (propertyFactory) => new GameActions.AddTokenAction(propertyFactory, 'growth'),
    addWardToken: (propertyFactory) => new GameActions.AddTokenAction(propertyFactory, 'ward'),
    archive: (propertyFactory) => new GameActions.ArchiveAction(propertyFactory),
    attach: (propertyFactory) => new GameActions.AttachAction(propertyFactory), // upgrade
    capture: (propertyFactory) => new GameActions.CaptureAction(propertyFactory),
    cardLastingEffect: (propertyFactory) => new GameActions.LastingEffectCardAction(propertyFactory), // duration = 'untilEndOfConflict', effect, targetLocation, condition, until
    clearGrowthTokens: (propertyFactory) => new GameActions.RemoveTokenAction(propertyFactory, 'growth'),
    clearGloryCounters: (propertyFactory) => new GameActions.RemoveTokenAction(propertyFactory, 'glory'),
    changeActiveHouse: (propertyFactory) => new GameActions.ChangeActiveHouseAction(propertyFactory),
    dealDamage: (propertyFactory) => new GameActions.DealDamageAction(propertyFactory),
    delayedEffect: (propertyFactory) => new GameActions.DelayedEffectAction(propertyFactory), // when, message, gameAction, handler
    discard: (propertyFactory) => new GameActions.DiscardCardAction(propertyFactory),
    destroy: (propertyFactory) => new GameActions.DestroyAction(propertyFactory),
    enrage: (propertyFactory) => new GameActions.EnrageAction(propertyFactory),
    exalt: (propertyFactory) => new GameActions.ExaltAction(propertyFactory), // amount = 1
    exhaust: (propertyFactory) => new GameActions.ExhaustAction(propertyFactory),
    fight: (propertyFactory) => new GameActions.FightGameAction(propertyFactory),
    graft: (propertyFactory) => new GameActions.PlaceUnderAction(propertyFactory, true),
    heal: (propertyFactory) => new GameActions.HealAction(propertyFactory),
    moveCard: (propertyFactory) => new GameActions.MoveCardAction(propertyFactory), // destination, switch = false, shuffle = false
    moveOnBattleline: (propertyFactory) => new GameActions.MoveOnBattlelineAction(propertyFactory),
    moveToFlank: (propertyFactory) => new GameActions.MoveToFlankAction(propertyFactory),
    placeAmber: (propertyFactory) => new GameActions.AddTokenAction(propertyFactory, 'amber'), // amount = 1
    placeUnder: (propertyFactory) => new GameActions.PlaceUnderAction(propertyFactory), // parent
    playCard: (propertyFactory) => new GameActions.PlayCardAction(propertyFactory), // resetOnCancel = false, postHandler
    purge: (propertyFactory) => new GameActions.PurgeAction(propertyFactory),
    putIntoPlay: (propertyFactory) => new GameActions.PutIntoPlayAction(propertyFactory),
    ready: (propertyFactory) => new GameActions.ReadyAction(propertyFactory),
    reap: (propertyFactory) => new GameActions.ReapGameAction(propertyFactory),
    rearrangeBattleline: (propertyFactory) => new GameActions.RearrangeBattlelineAction(propertyFactory),
    reduceArmor: (propertyFactory) => new GameActions.ReduceArmorAction(propertyFactory),
    removeAmber: (propertyFactory) => new GameActions.RemoveTokenAction(propertyFactory, 'amber'),
    removeDamage: (propertyFactory) => new GameActions.RemoveTokenAction(propertyFactory, 'damage'),
    removePowerCounter: (propertyFactory) => new GameActions.RemoveTokenAction(propertyFactory),
    removeStun: (propertyFactory) => new GameActions.RemoveStunAction(propertyFactory),
    removeWard: (propertyFactory) => new GameActions.RemoveWardAction(propertyFactory),
    removeWardToken: (propertyFactory) => new GameActions.RemoveTokenAction(propertyFactory, 'ward'),
    resolveAbility: (propertyFactory) => new GameActions.ResolveAbilityAction(propertyFactory), // ability
    resolveFight: (propertyFactory) => new GameActions.ResolveFightAction(propertyFactory), // this shouldn't normally be needed
    returnAmber: (propertyFactory) => new GameActions.ReturnAmberAction(propertyFactory),
    returnToDeck: (propertyFactory) => new GameActions.ReturnToDeckAction(propertyFactory), // bottom = false
    returnToHand: (propertyFactory) => new GameActions.ReturnToHandAction(propertyFactory),
    reveal: (propertyFactory) => new GameActions.RevealAction(propertyFactory),
    sacrifice: (propertyFactory) => new GameActions.DestroyAction(propertyFactory, true),
    stun: (propertyFactory) => new GameActions.StunAction(propertyFactory),
    swap: (propertyFactory) => new GameActions.SwapAction(propertyFactory), // origin
    use: (propertyFactory) => new GameActions.UseAction(propertyFactory),
    ward: (propertyFactory) => new GameActions.WardAction(propertyFactory),
    // player actions
    archiveAtRandom: (propertyFactory) => new GameActions.RandomArchiveAction(propertyFactory), // amount = 1
    chosenDiscard: (propertyFactory) => new GameActions.ChosenDiscardAction(propertyFactory), // amount = 1
    discardAtRandom: (propertyFactory) => new GameActions.RandomDiscardAction(propertyFactory), // amount = 1
    purgeAtRandom: (propertyFactory) => new GameActions.RandomPurgeAction(propertyFactory), // amount = 1
    draw: (propertyFactory) => new GameActions.DrawAction(propertyFactory), // amount = 1
    forgeKey: (propertyFactory) => new GameActions.ForgeAction(propertyFactory), // modifier = 0
    forRemainderOfTurn: (propertyFactory) => new GameActions.LastingEffectAction(propertyFactory, 1),
    untilNextTurn: (propertyFactory) => new GameActions.LastingEffectAction(propertyFactory, 2),
    untilEndOfMyNextTurn: (propertyFactory) => new GameActions.LastingEffectAction(propertyFactory, 3),
    gainAmber: (propertyFactory) => new GameActions.ModifyAmberAction(propertyFactory), // amount = 1
    gainChains: (propertyFactory) => new GameActions.ModifyChainsActions(propertyFactory), // amount = 1
    lastingEffect: (propertyFactory) => new GameActions.LastingEffectAction(propertyFactory),
    loseAmber: (propertyFactory) => new GameActions.LoseAmberAction(propertyFactory),
    rearrangeCards: (propertFactory) => new GameActions.RearrangeCardsAction(propertFactory),
    search: (propertyFactory) => new GameActions.SearchAction(propertyFactory), // name
    steal: (propertyFactory) => new GameActions.StealAction(propertyFactory), // amount = 1
    transferAmber: (propertyFactory) => new GameActions.TransferAmberAction(propertyFactory), // amount = 1
    unforgeKey: (propertyFactory) => new GameActions.UnforgeAction(propertyFactory),
    // meta actions
    addEventToWindow: (propertyFactory) => new GameActions.AddEventToWindowAction(propertyFactory),
    allocateDamage: (propertyFactory) => new GameActions.AllocateDamageAction(propertyFactory),
    changeEvent: (propertyFactory) => new GameActions.ChangeEventAction(propertyFactory),
    chooseAction: (propertyFactory) => new GameActions.ChooseGameAction(propertyFactory), // choices, activePromptTitle = 'Select one'
    conditional: (propertyFactory) => new GameActions.ConditionalAction(propertyFactory),
    jointAction: (gameActions) => new GameActions.JointGameAction(gameActions), // takes an array of gameActions, not a propertyFactory
    sequential: (gameActions) => new GameActions.SequentialAction(gameActions), // takes an array of gameActions, not a propertyFactory
    sequentialForEach: (propertyFactory) => new GameActions.SequentialForEachAction(propertyFactory)
};

module.exports = Actions;
