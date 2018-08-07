const ArchiveAction = require('./GameActions/ArchiveAction');
const AttachAction = require('./GameActions/AttachAction');
const CaptureAction = require('./GameActions/CaptureAction');
const ChooseGameAction = require('./GameActions/ChooseGameAction');
const ChosenDiscardAction = require('./GameActions/ChosenDiscardAction');
const DeckSearchAction = require('./GameActions/DeckSearchAction');
const DelayedEffectAction = require('./GameActions/DelayedEffectAction');
const DestroyAction = require('./GameActions/DestroyAction');
const DiscardCardAction = require('./GameActions/DiscardCardAction');
const DrawAction = require('./GameActions/DrawAction');
const ExhaustAction = require('./GameActions/ExhaustAction');
const FightGameAction = require('./GameActions/FightGameAction');
const ForgeAction = require('./GameActions/ForgeAction');
const JointGameAction = require('./GameActions/JointGameAction');
const LastingEffectAction = require('./GameActions/LastingEffectAction');
const LastingEffectCardAction = require('./GameActions/LastingEffectCardAction');
const RevealAction = require('./GameActions/RevealAction');
const ModifyAmberAction = require('./GameActions/ModifyAmberAction');
const MoveCardAction = require('./GameActions/MoveCardAction');
const PlayCardAction = require('./GameActions/PlayCardAction');
const PutIntoPlayAction = require('./GameActions/PutIntoPlayAction');
const RandomDiscardAction = require('./GameActions/RandomDiscardAction');
const ReadyAction = require('./GameActions/ReadyAction');
const ReapGameAction = require('./GameActions/ReapGameAction');
const ResolveAbilityAction = require('./GameActions/ResolveAbilityAction');
const ReturnToDeckAction = require('./GameActions/ReturnToDeckAction');
const ReturnToHandAction = require('./GameActions/ReturnToHandAction');
const StealAction = require('./GameActions/StealAction');
const UseAction = require('./GameActions/UseAction');

const Actions = {
    // card actions
    archive: (propertyFactory) => new ArchiveAction(propertyFactory),
    attach: (propertyFactory) => new AttachAction(propertyFactory), // attachment
    capture: (propertyFactory) => new CaptureAction(propertyFactory),
    cardLastingEffect: (propertyFactory) => new LastingEffectCardAction(propertyFactory), // duration = 'untilEndOfConflict', effect, targetLocation, condition, until
    delayedEffect: (propertyFactory) => new DelayedEffectAction(propertyFactory), // when, message, gameAction, handler
    discard: (propertyFactory) => new DiscardCardAction(propertyFactory),
    destroy: (propertyFactory) => new DestroyAction(propertyFactory),
    exhaust: (propertyFactory) => new ExhaustAction(propertyFactory),
    fight: (propertyFactory) => new FightGameAction(propertyFactory),
    moveCard: (propertyFactory) => new MoveCardAction(propertyFactory), // destination, switch = false, shuffle = false
    playCard: (propertyFactory) => new PlayCardAction(propertyFactory), // resetOnCancel = false, postHandler
    putIntoPlay: (propertyFactory) => new PutIntoPlayAction(propertyFactory),
    ready: (propertyFactory) => new ReadyAction(propertyFactory),
    reap: (propertyFactory) => new ReapGameAction(propertyFactory),
    resolveAbility: (propertyFactory) => new ResolveAbilityAction(propertyFactory), // ability
    returnToDeck: (propertyFactory) => new ReturnToDeckAction(propertyFactory), // bottom = false
    returnToHand: (propertyFactory) => new ReturnToHandAction(propertyFactory),
    reveal: (propertyFactory) => new RevealAction(propertyFactory),
    sacrifice: (propertyFactory) => new DestroyAction(propertyFactory, true),
    use: (propertyFactory) => new UseAction(propertyFactory),
    // player actions
    chosenDiscard: (propertyFactory) => new ChosenDiscardAction(propertyFactory), // amount = 1
    deckSearch: (propertyFactory) => new DeckSearchAction(propertyFactory), // amount = -1, reveal = true, cardCondition = (card, context) => true
    discardAtRandom: (propertyFactory) => new RandomDiscardAction(propertyFactory), // amount = 1
    draw: (propertyFactory) => new DrawAction(propertyFactory), // amount = 1
    forgeKey: (propertyFactory) => new ForgeAction(propertyFactory), // modifier = 0
    forRemainderOfTurn: (propertyFactory) => new LastingEffectAction(propertyFactory, 1),
    gainAmber: (propertyFactory) => new ModifyAmberAction(propertyFactory), // amount = 1
    lastingEffect: (propertyFactory) => new LastingEffectAction(propertyFactory),
    steal: (propertyFactory) => new StealAction(propertyFactory), // amount = 1
    // meta actions
    chooseAction: (propertyFactory) => new ChooseGameAction(propertyFactory), // choices, activePromptTitle = 'Select one'
    jointAction: (gameActions) => new JointGameAction(gameActions) // takes an array of gameActions, not a propertyFactory
};

module.exports = Actions;
