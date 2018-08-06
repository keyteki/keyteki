const gameActions = require('./GameActions');

const Actions = {
    // card actions
    archive: (propertyFactory) => new gameActions.ArchiveAction(propertyFactory),
    attach: (propertyFactory) => new gameActions.AttachAction(propertyFactory), // attachment
    exhaust: (propertyFactory) => new gameActions.ExhaustAction(propertyFactory),
    capture: (propertyFactory) => new gameActions.CaptureAction(propertyFactory),
    cardLastingEffect: (propertyFactory) => new gameActions.LastingEffectCardAction(propertyFactory), // duration = 'untilEndOfConflict', effect, targetLocation, condition, until
    delayedEffect: (propertyFactory) => new gameActions.DelayedEffectAction(propertyFactory), // when, message, gameAction, handler
    discard: (propertyFactory) => new gameActions.DiscardCardAction(propertyFactory),
    destroy: (propertyFactory) => new gameActions.DestroyAction(propertyFactory),
    lookAt: (propertyFactory) => new gameActions.LookAtAction(propertyFactory),
    moveCard: (propertyFactory) => new gameActions.MoveCardAction(propertyFactory), // destination, switch = false, shuffle = false
    playCard: (propertyFactory) => new gameActions.PlayCardAction(propertyFactory), // resetOnCancel = false, postHandler
    putIntoPlay: (propertyFactory) => new gameActions.PutIntoPlayAction(propertyFactory, false), // fate = 0
    ready: (propertyFactory) => new gameActions.ReadyAction(propertyFactory),
    resolveAbility: (propertyFactory) => new gameActions.ResolveAbilityAction(propertyFactory), // ability
    returnToDeck: (propertyFactory) => new gameActions.ReturnToDeckAction(propertyFactory), // bottom = false
    returnToHand: (propertyFactory) => new gameActions.ReturnToHandAction(propertyFactory),
    sacrifice: (propertyFactory) => new gameActions.DestroyAction(propertyFactory, true),
    // player actions
    chosenDiscard: (propertyFactory) => new gameActions.ChosenDiscardAction(propertyFactory), // amount = 1
    deckSearch: (propertyFactory) => new gameActions.DeckSearchAction(propertyFactory), // amount = -1, reveal = true, cardCondition = (card, context) => true
    discardAtRandom: (propertyFactory) => new gameActions.RandomDiscardAction(propertyFactory), // amount = 1
    draw: (propertyFactory) => new gameActions.DrawAction(propertyFactory), // amount = 1
    forRemainderOfTurn: (propertyFactory) => new gameActions.LastingEffectAction(propertyFactory, 1),
    gainAmber: (propertyFactory) => new gameActions.ModifyAmberAction(propertyFactory), // amount = 1
    steal: (propertyFactory) => new gameActions.StealAction(propertyFactory), // amount = 1
    // meta actions
    chooseAction: (propertyFactory) => new gameActions.ChooseGameAction(propertyFactory), // choices, activePromptTitle = 'Select one'
    jointAction: (gameActions) => new gameActions.JointGameAction(gameActions) // takes an array of gameActions, not a propertyFactory
};

module.exports = Actions;
