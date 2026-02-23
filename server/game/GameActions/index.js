import ActivateProphecyAction from './ActivateProphecyAction.js';
import AddEventToWindowAction from './AddEventToWindowAction.js';
import AddTokenAction from './AddTokenAction.js';
import AllocateDamageAction from './AllocateDamageAction.js';
import ArchiveAction from './ArchiveAction.js';
import ApplyDamageAction from './ApplyDamageAction.js';
import AttachAction from './AttachAction.js';
import CaptureAction from './CaptureAction.js';
import CardLastingEffectAction from './CardLastingEffectAction.js';
import ChangeActiveHouseAction from './ChangeActiveHouse.js';
import ChangeEventAction from './ChangeEventAction.js';
import ChooseGameAction from './ChooseGameAction.js';
import ChosenDiscardAction from './ChosenDiscardAction.js';
import ConditionalAction from './ConditionalAction.js';
import DeactivateProphecyAction from './DeactivateProphecyAction.js';
import DealDamageAction from './DealDamageAction.js';
import DelayedEffectAction from './DelayedEffectAction.js';
import DestroyAction from './DestroyAction.js';
import DiscardCardAction from './DiscardCardAction.js';
import DiscardEntireLocationAction from './DiscardEntireLocationAction.js';
import DiscardRandomCardsToAmountAction from './DiscardRandomCardsToAmountAction.js';
import DiscardTopOfDeckAction from './DiscardTopOfDeckAction.js';
import DrawAction from './DrawAction.js';
import EnrageAction from './EnrageAction.js';
import ExaltAction from './ExaltAction.js';
import ExhaustAction from './ExhaustAction.js';
import FightGameAction from './FightGameAction.js';
import FlipAction from './FlipAction.js';
import FlipProphecyAction from './FlipProphecyAction.js';
import ForgeAction from './ForgeAction.js';
import FulfillProphecyAction from './FulfillProphecyAction.js';
import HealAction from './HealAction.js';
import JointGameAction from './JointGameAction.js';
import LastingEffectAction from './LastingEffectAction.js';
import LoseAmberAction from './LoseAmberAction.js';
import ModifyAmberAction from './ModifyAmberAction.js';
import ModifyChainsActions from './ModifyChainsAction.js';
import MoveCardAction from './MoveCardAction.js';
import MoveOnBattlelineAction from './MoveOnBattlelineAction.js';
import MoveToBottomAction from './MoveToBottomAction.js';
import MoveToFlankAction from './MoveToFlankAction.js';
import MoveUpgrade from './MoveUpgrade.js';
import MoveUpgradeToFlank from './MoveUpgradeToFlank.js';
import MulliganAction from './MulliganAction.js';
import ResetTideAction from './ResetTideAction.js';
import PlaceUnderAction from './PlaceUnderAction.js';
import PlayCardAction from './PlayCardAction.js';
import PlayUpgradeOnParentAction from './PlayUpgradeOnParentAction.js';
import MakeTokenCreatureAction from './MakeTokenCreatureAction.js';
import PurgeAction from './PurgeAction.js';
import PutIntoPlayAction from './PutIntoPlayAction.js';
import RaiseTideAction from './RaiseTideAction.js';
import RandomArchiveAction from './RandomArchiveAction.js';
import RandomDiscardAction from './RandomDiscardAction.js';
import RandomPlayCardAction from './RandomPlayCardAction.js';
import RandomPurgeAction from './RandomPurgeAction.js';
import ReadyAction from './ReadyAction.js';
import ReapGameAction from './ReapGameAction.js';
import RearrangeBattlelineAction from './RearrangeBattlelineAction.js';
import RearrangeCardsAction from './RearrangeCardsAction.js';
import ReduceArmorAction from './ReduceArmorAction.js';
import RemoveStunAction from './RemoveStunAction.js';
import RemoveTokenAction from './RemoveTokenAction.js';
import RemoveAllTokensAction from './RemoveAllTokensAction.js';
import RemoveWardAction from './RemoveWardAction.js';
import ResolveAbilityAction from './ResolveAbilityAction.js';
import ResolveBonusIconsAction from './ResolveBonusIconsAction.js';
import ResolveFateAction from './ResolveFateAction.js';
import ResolveFightAction from './ResolveFightAction.js';
import ReturnAmberAction from './ReturnAmberAction.js';
import ReturnToDeckAction from './ReturnToDeckAction.js';
import ReturnToHandAction from './ReturnToHandAction.js';
import RevealAction from './RevealAction.js';
import SearchAction from './SearchAction.js';
import SequentialAction from './SequentialAction.js';
import SequentialCardLastingEffectAction from './SequentialCardLastingEffectAction.js';
import SequentialForEachAction from './SequentialForEachAction.js';
import SequentialFightAction from './SequentialFightAction.js';
import SequentialMakeTokenCreatureAction from './SequentialMakeTokenCreatureAction.js';
import SequentialPairedChoicesAction from './SequentialPairedChoicesAction.js';
import SequentialPlayAction from './SequentialPlayAction.js';
import SequentialPutIntoPlayAction from './SequentialPutIntoPlayAction.js';
import ShuffleDeckAction from './ShuffleDeckAction.js';
import StealAction from './StealAction.js';
import StunAction from './StunAction.js';
import SwapAction from './SwapAction.js';
import SwapDiscardWithHandAction from './SwapDiscardWithHandAction.js';
import TransferAmberAction from './TransferAmberAction.js';
import UnforgeAction from './UnforgeAction.js';
import UseAction from './UseAction.js';
import WardAction from './WardAction.js';

const GameActions = {
    ActivateProphecyAction,
    AddEventToWindowAction,
    AddTokenAction,
    AllocateDamageAction,
    ArchiveAction,
    ApplyDamageAction,
    AttachAction,
    CaptureAction,
    CardLastingEffectAction,
    ChangeActiveHouseAction,
    ChangeEventAction,
    ChooseGameAction,
    ChosenDiscardAction,
    ConditionalAction,
    DeactivateProphecyAction,
    DealDamageAction,
    DelayedEffectAction,
    DestroyAction,
    DiscardCardAction,
    DiscardEntireLocationAction,
    DiscardRandomCardsToAmountAction,
    DiscardTopOfDeckAction,
    DrawAction,
    EnrageAction,
    ExaltAction,
    ExhaustAction,
    FightGameAction,
    FlipAction,
    FlipProphecyAction,
    ForgeAction,
    FulfillProphecyAction,
    HealAction,
    JointGameAction,
    LastingEffectAction,
    LoseAmberAction,
    ModifyAmberAction,
    ModifyChainsActions,
    MoveCardAction,
    MoveOnBattlelineAction,
    MoveToBottomAction,
    MoveToFlankAction,
    MoveUpgrade,
    MoveUpgradeToFlank,
    MulliganAction,
    ResetTideAction,
    PlaceUnderAction,
    PlayCardAction,
    PlayUpgradeOnParentAction,
    MakeTokenCreatureAction,
    PurgeAction,
    PutIntoPlayAction,
    RaiseTideAction,
    RandomArchiveAction,
    RandomDiscardAction,
    RandomPlayCardAction,
    RandomPurgeAction,
    ReadyAction,
    ReapGameAction,
    RearrangeBattlelineAction,
    RearrangeCardsAction,
    ReduceArmorAction,
    RemoveStunAction,
    RemoveTokenAction,
    RemoveAllTokensAction,
    RemoveWardAction,
    ResolveAbilityAction,
    ResolveBonusIconsAction,
    ResolveFateAction,
    ResolveFightAction,
    ReturnAmberAction,
    ReturnToDeckAction,
    ReturnToHandAction,
    RevealAction,
    SearchAction,
    SequentialAction,
    SequentialCardLastingEffectAction,
    SequentialForEachAction,
    SequentialFightAction,
    SequentialMakeTokenCreatureAction,
    SequentialPairedChoicesAction,
    SequentialPlayAction,
    SequentialPutIntoPlayAction,
    ShuffleDeckAction,
    StealAction,
    StunAction,
    SwapAction,
    SwapDiscardWithHandAction,
    TransferAmberAction,
    UnforgeAction,
    UseAction,
    WardAction
};

export default GameActions;

export {
    ActivateProphecyAction,
    AddEventToWindowAction,
    AddTokenAction,
    AllocateDamageAction,
    ArchiveAction,
    ApplyDamageAction,
    AttachAction,
    CaptureAction,
    CardLastingEffectAction,
    ChangeActiveHouseAction,
    ChangeEventAction,
    ChooseGameAction,
    ChosenDiscardAction,
    ConditionalAction,
    DeactivateProphecyAction,
    DealDamageAction,
    DelayedEffectAction,
    DestroyAction,
    DiscardCardAction,
    DiscardEntireLocationAction,
    DiscardRandomCardsToAmountAction,
    DiscardTopOfDeckAction,
    DrawAction,
    EnrageAction,
    ExaltAction,
    ExhaustAction,
    FightGameAction,
    FlipAction,
    FlipProphecyAction,
    ForgeAction,
    FulfillProphecyAction,
    HealAction,
    JointGameAction,
    LastingEffectAction,
    LoseAmberAction,
    ModifyAmberAction,
    ModifyChainsActions,
    MoveCardAction,
    MoveOnBattlelineAction,
    MoveToBottomAction,
    MoveToFlankAction,
    MoveUpgrade,
    MoveUpgradeToFlank,
    MulliganAction,
    ResetTideAction,
    PlaceUnderAction,
    PlayCardAction,
    PlayUpgradeOnParentAction,
    MakeTokenCreatureAction,
    PurgeAction,
    PutIntoPlayAction,
    RaiseTideAction,
    RandomArchiveAction,
    RandomDiscardAction,
    RandomPlayCardAction,
    RandomPurgeAction,
    ReadyAction,
    ReapGameAction,
    RearrangeBattlelineAction,
    RearrangeCardsAction,
    ReduceArmorAction,
    RemoveStunAction,
    RemoveTokenAction,
    RemoveAllTokensAction,
    RemoveWardAction,
    ResolveAbilityAction,
    ResolveBonusIconsAction,
    ResolveFateAction,
    ResolveFightAction,
    ReturnAmberAction,
    ReturnToDeckAction,
    ReturnToHandAction,
    RevealAction,
    SearchAction,
    SequentialAction,
    SequentialCardLastingEffectAction,
    SequentialForEachAction,
    SequentialFightAction,
    SequentialMakeTokenCreatureAction,
    SequentialPairedChoicesAction,
    SequentialPlayAction,
    SequentialPutIntoPlayAction,
    ShuffleDeckAction,
    StealAction,
    StunAction,
    SwapAction,
    SwapDiscardWithHandAction,
    TransferAmberAction,
    UnforgeAction,
    UseAction,
    WardAction
};
