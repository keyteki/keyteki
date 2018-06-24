const AttachAction = require('./AttachAction');
const BowAction = require('./BowAction');
const BreakAction = require('./BreakAction');
const ChosenDiscardAction = require('./ChosenDiscardAction');
const DeckSearchAction = require('./DeckSearchAction');
const DelayedEffectAction = require('./DelayedEffectAction');
const DiscardFavorAction = require('./DiscardFavorAction');
const DiscardFromPlayAction = require('./DiscardFromPlayAction');
const DiscardCardAction = require('./DiscardCardAction');
const DiscardStatusAction = require('./DiscardStatusAction');
const DishonorAction = require('./DishonorAction');
const DrawAction = require('./DrawAction');
const DuelAction = require('./DuelAction');
const FireRingAction = require('./FireRingAction');
const FlipDynastyAction = require('./FlipDynastyAction');
const GainHonorAction = require('./GainHonorAction');
const HonorAction = require('./HonorAction');
const InitiateConflictAction = require('./InitiateConflictAction');
const JointGameAction = require('./JointGameAction');
const LastingEffectAction = require('./LastingEffectAction');
const LastingEffectCardAction = require('./LastingEffectCardAction');
const LastingEffectRingAction = require('./LastingEffectRingAction');
const LoseHonorAction = require('./LoseHonorAction');
const ModifyBidAction = require('./ModifyBidAction');
const ModifyFateAction = require('./ModifyFateAction');
const MoveToConflictAction = require('./MoveToConflictAction');
const PlaceFateAction = require('./PlaceFateAction');
const PlaceFateRingAction = require('./PlaceFateRingAction');
const PlayCardAction = require('./PlayCardAction');
const PutIntoPlayAction = require('./PutIntoPlayAction');
const RandomDiscardAction = require('./RandomDiscardAction');
const ReadyAction = require('./ReadyAction');
const RemoveFateAction = require('./RemoveFateAction');
const ResolveAbilityAction = require('./ResolveAbilityAction');
const ResolveRingAction = require('./ResolveRingAction');
const ReturnRingAction = require('./ReturnRingAction');
const ReturnToDeckAction = require('./ReturnToDeckAction');
const ReturnToHandAction = require('./ReturnToHandAction');
const RevealAction = require('./RevealAction');
const SendHomeAction = require('./SendHomeAction');
const TakeFateRingAction = require('./TakeFateRingAction');
const TakeRingAction = require('./TakeRingAction');
const TransferFateAction = require('./TransferFateAction');
const TransferHonorAction = require('./TransferHonorAction');

const GameActions = {
    // card actions
    attach: (propertyFactory) => new AttachAction(propertyFactory), // attachment
    bow: (propertyFactory) => new BowAction(propertyFactory),
    break: (propertyFactory) => new BreakAction(propertyFactory),
    cardLastingEffect: (propertyFactory) => new LastingEffectCardAction(propertyFactory), // duration = 'untilEndOfConflict', effect, targetLocation, condition, until
    delayedEffect: (propertyFactory) => new DelayedEffectAction(propertyFactory), // when, message, gameAction, handler
    discardCard: (propertyFactory) => new DiscardCardAction(propertyFactory),
    discardFromPlay: (propertyFactory) => new DiscardFromPlayAction(propertyFactory),
    discardStatusToken: (propertyFactory) => new DiscardStatusAction(propertyFactory),
    dishonor: (propertyFactory) => new DishonorAction(propertyFactory),
    duel: (propertyFactory) => new DuelAction(propertyFactory), // type, challenger, resolutionHandler, costHandler
    fireRingEffect: (propertyFactory) => new FireRingAction(propertyFactory),
    flipDynasty: (propertyFactory) => new FlipDynastyAction(propertyFactory),
    honor: (propertyFactory) => new HonorAction(propertyFactory),
    moveToConflict: (propertyFactory) => new MoveToConflictAction(propertyFactory),
    placeFate: (propertyFactory) => new PlaceFateAction(propertyFactory), // amount = 1, origin
    playCard: (propertyFactory) => new PlayCardAction(propertyFactory), // resetOnCancel = false, postHandler
    putIntoConflict: (propertyFactory) => new PutIntoPlayAction(propertyFactory), // fate = 0
    putIntoPlay: (propertyFactory) => new PutIntoPlayAction(propertyFactory, false), // fate = 0
    ready: (propertyFactory) => new ReadyAction(propertyFactory),
    removeFate: (propertyFactory) => new RemoveFateAction(propertyFactory), // amount = 1, recipient
    resolveAbility: (propertyFactory) => new ResolveAbilityAction(propertyFactory), // ability
    returnToDeck: (propertyFactory) => new ReturnToDeckAction(propertyFactory), // bottom = false
    returnToHand: (propertyFactory) => new ReturnToHandAction(propertyFactory),
    reveal: (propertyFactory) => new RevealAction(propertyFactory),
    sendHome: (propertyFactory) => new SendHomeAction(propertyFactory),
    sacrifice: (propertyFactory) => new DiscardFromPlayAction(propertyFactory, true),
    // player actions
    chosenDiscard: (propertyFactory) => new ChosenDiscardAction(propertyFactory), // amount = 1
    deckSearch: (propertyFactory) => new DeckSearchAction(propertyFactory), // amount = -1, reveal = true, cardCondition = (card, context) => true
    discardAtRandom: (propertyFactory) => new RandomDiscardAction(propertyFactory), // amount = 1
    draw: (propertyFactory) => new DrawAction(propertyFactory), // amount = 1
    gainFate: (propertyFactory) => new ModifyFateAction(propertyFactory), // amount = 1
    gainHonor: (propertyFactory) => new GainHonorAction(propertyFactory), // amount = 1
    initiateConflict: (propertyFactory) => new InitiateConflictAction(propertyFactory), // canPass = true
    loseHonor: (propertyFactory) => new LoseHonorAction(propertyFactory), // amount = 1
    loseImperialFavor: (propertyFactory) => new DiscardFavorAction(propertyFactory),
    modifyBid: (propertyFactory) => new ModifyBidAction(propertyFactory), // amount = 1, direction = 'increast', promptPlayer = false
    playerLastingEffect: (propertyFactory) => new LastingEffectAction(propertyFactory), // duration = 'untilEndOfConflict', effect, targetController, condition, until
    takeFate: (propertyFactory) => new TransferFateAction(propertyFactory), // amount = 1
    takeHonor: (propertyFactory) => new TransferHonorAction(propertyFactory), // amount = 1
    // ring actions
    placeFateOnRing: (propertyFactory) => new PlaceFateRingAction(propertyFactory), // amount = 1, origin
    resolveRing: (propertyFactory) => new ResolveRingAction(propertyFactory), // resolveAsAttacker = true
    returnRing: (propertyFactory) => new ReturnRingAction(propertyFactory),
    ringLastingEffect: (propertyFactory) => new LastingEffectRingAction(propertyFactory), // duration = 'untilEndOfConflict', effect, condition, until
    takeFateFromRing: (propertyFactory) => new TakeFateRingAction(propertyFactory), // amount = 1
    takeRing: (propertyFactory) => new TakeRingAction(propertyFactory),
    // meta actions
    jointAction: (gameActions) => new JointGameAction(gameActions) // takes an array of gameActions, not a propertyFactory
};

module.exports = GameActions;
