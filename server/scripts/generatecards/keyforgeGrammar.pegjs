{
  function flattenArrays(array) {
    let items = []
    for(let item of array)
    	if(!Array.isArray(item))
        	items.push(item)
        else
        	items = items.concat(flattenArrays(item))
    return items
  }
  function sortActions(actions) {
    //This function will need to get smarter to support other cards.
    //Actual rules should be:
    //Sentence by sentence.
    //Some sentences combine.
    // * Choose + effect. (Probably combined in parser?)
    // * Something + instead.
    // * Damage sentences (e.g. they're everywhere.)
    // Effects will be chained using Then.
    let firstEffect = {
        optional: false,
        targets: [],
        default: [],
        then: null,
        unknown: [],
        condition: null
    };

	let lastEffect = firstEffect;
	let lastTarget = null;

    for (let effect of actions) {
            let previousEffects = lastEffect.targets.concat(lastEffect.default);
            if (
                effect.then ||
                (previousEffects.length > 0 &&
                    !(isDamageEffect(effect) && previousEffects.some(isDamageEffect)) &&
                    (isTargetted(effect) || effect.condition || usesEventMultiplier(effect)))
            ) {
                let newEffect = {
                    optional: false,
                    targets: [],
                    default: [],
                    then: null,
                    unknown: [],
                    alwaysTriggers: !effect.then,
                    condition: null
                };
                lastEffect.then = newEffect;
				lastEffect = newEffect;
				lastTarget = null;
            }
            if (effect.optional) lastEffect.optional = true;
            if (effect.condition) lastEffect.condition = effect.condition;
            if (isTargetted(effect)) {
				lastTarget = Object.assign({}, effect.target, {actions:[]})
				lastEffect.targets.push(lastTarget);
				if(effect.name)
					lastTarget.actions.push(simpleAction(effect))
			} else if (effect.target && effect.target.mode == 'it' && lastTarget) {
				lastTarget.actions.push(simpleAction(effect))
            } else {
                lastEffect.default.push(effect);
            }
    }
    return firstEffect;
}
function simpleAction(action) {
	delete action.target
    return action
}
function isTargetted(effect) {
    let untargettedModes = ['all', 'self', 'this', 'it', 'topdeck'];
    return effect.target && !untargettedModes.includes(effect.target.mode);
}
function isDamageEffect(effect) {
    return effect.name === 'dealDamage';
}
function usesEventMultiplier(effect) {
    if (effect === null) return false;
    if (effect.name === 'healedThisWay' || effect.name === 'destroyedThisWay' || effect.name === 'exhaustedThisWay') return true;
    return typeof effect === 'object' && Object.values(effect).some(usesEventMultiplier);
}
}

//Structure
Lines = line:Line tail:(NewLine l:Line {return l;})* NewLine? {
	return flattenArrays([line, ...tail])
}

Line = _ ability:(Keywords / BoldAbility / PersistentEffect / GeneralTrigger / ReminderText / _ )
	_ unknown:(_ e:UnknownFragment [.;]? _ {return e;})*
{
	if(unknown.length > 0)
    	return [ability, ...unknown]
    return ability
}

NewLine = [\n\r\u000b]+ {
	return { name: "newline"}
}

//Supported ability formats.
//Keywords
Keywords = word:Keyword tail:(". " w:Keyword {return w;})* [.;]? _ ReminderText? {
	return {
		name: "keywords",
		keywords: [word, ...tail]
	}
}

Keyword = name:("Elusive"i / "Skirmish"i / "Taunt"i / "Poison"i / "Deploy"i / "Alpha"i
/ "Omega"i / "Assault"i / "Hazardous"i / "Invulnerable"i / e:"Enhance"i _ [A-Z]i+ {return e;})
_ count:Integer? {
	return {name: name.toLowerCase(), count};
}

//"Bold" effects (Play, fight, reap, destroyed etc.)
BoldAbility = trigger:BoldTrigger extraTriggers:("/" t:BoldTrigger {return t;})* ": " actions:ActionList {
	return {
		name: 'bold',
        trigger, extraTriggers,
		actions:sortActions(actions)
	}
}

BoldTrigger = ("Play" / "Reap" / "After Reap" / "Before Fight" / "Fight" / "After Fight" / "Destroyed" / "Action" / "Omni") {
	if (text() == "Before Fight") return "beforeFight";
	if (text() == "After Reap") return "reap";
	if (text() == "After Fight") return "fight";
	return text().toLowerCase();
}

//Persistent effects. If conditions are required for things like bonesaw
PersistentEffect = SinglePersistentEffect+

SinglePersistentEffect = condition:(WhileCondition/IfCondition)? _
pe:(PersistentPlayerEffect/PersistentCardEffect/Gigantic) [.;]? _ ReminderText? {
    return Object.assign({name: 'persistentEffect', condition}, pe)
}

Gigantic = "(Play only with the other half of $this.)" {
	return {name:"unknown", text:text()}
}

PersistentPlayerEffect = targetPlayer:PlayerTarget? _ effect:SinglePersistentPlayerEffect {
	return {
		targetPlayer,
		effects: [effect]
	}
} / SpecialPersistentPlayerEffect //For effects with more unique formats.

PersistentCardEffect = target:GeneralCardTarget? _ effects:PersistentCardEffectList [.;]? {
	return  {
		target,
		effects: flattenArrays(effects).filter(x => x !== null)
	}
}

PersistentCardEffectList = item:SinglePersistentCardEffect _ items:(_ And _ e:SinglePersistentCardEffect {return e;})* {
	return [item, ...items]
}

//General triggers
GeneralTrigger = GeneralPersistentTrigger/GeneralDurationTrigger/PhaseTrigger/SpontaneousTrigger

//Spontaneous means that as soon as a condition is met, a certain effect will occur
SpontaneousTrigger = condition:IfCondition _ actions:ActionList {
	return {
		name: "persistentEffect",
		effects: [{
			name: "terminalCondition",
			actions: Object.assign(sortActions(actions), {condition})
		}]
	}
}

//Persistent effects typically list the trigger, then the effect. Duration effects typically reverse that.
GeneralPersistentTrigger = ("Each time"i/"After"i) _ trigger:Trigger "," _ actions:SentenceActionList [.;]? {
	return {name: "reaction", trigger, actions:sortActions(actions)}
}
GeneralDurationTrigger = action:SingleAction _ "each time"i _ trigger:Trigger {
	return {name: "reaction", trigger, actions:sortActions([action])}
}

//Phase or turn based triggers use different wording
PhaseTrigger = "At the"i _ part:("start"/"end") _ "of" _ player:PlayerTarget _
	trigger:("turn"{return null}/"“ready cards” step" {return "onCardsReadied"}) ","
	actions:ActionList [.;]? {
	return {
		name: "reaction",
		trigger: {
			trigger: trigger || (part == "start" ? "onBeginRound" : "onRoundEnded"),
			conditions:[{name:'turn', player}]
		},
		actions:sortActions(actions)
	}
}

//All the actual triggers
Trigger = PlayerFocusedTrigger / CardFocusedTrigger / PlayerAndCardFocusedTrigger

PlayerFocusedTrigger = eventPlayer:PlayerTarget _ trigger:PlayerTriggerType {
	return {trigger, eventPlayer};
}

CardFocusedTrigger = ("an"/"a") _ card:ConditionalCardTarget _ trigger:CardTriggerType
	_ location:LocationCondition? _ turn:TurnCondition? {
	return {trigger, card, conditions:flattenArrays([location, turn].filter(x => x !== null))}
}

TurnCondition = "during" _ player:PlayerTarget _ "your turn" {
	return {name: "turn", player}
}
LocationCondition = "from" _ controller:PlayerTarget _ location:"hand" {
	return [{name: "location", location}, {name:"controller", controller}]
}

PlayerAndCardFocusedTrigger = eventPlayer:PlayerTarget _ trigger:PlayerCardTriggerType _
	("an"/"a") _ card:ConditionalCardTarget {
	return {trigger, card, eventPlayer};
}

PlayerTriggerType = "forge" "s"? _ "a key" {return "forges"}/
"raise" "s"? _ "the tide" {return "onRaiseTide"}

PlayerCardTriggerType = t:("play"i/"use"i/"fight with"i {return "fight"}/"reap with"i {return "reap"}) "s"? {return t}

CardTriggerType = "is destroyed fighting $this" {return "destroyedFightingThis"}
	/"is destroyed" {return "destroyed"}
	/"reaps" {return "reap"}
	/"is used" {return "used"}
	/("fights"/"is used to fight") {return "fight"}
	/"enters play" {return "onCardEntersPlay"}
	/"is discarded" {return "onCardDiscarded"}

//Reminder text
ReminderText = _ ("(" [^)]+ ")"
	/"This card" _ ("is"/"has been") _ "translated"i [^.]* "."?
	/"This card is incomplete and subject to change"i "."?) _ {
	return {name: "reminderText", keywords: [text()]}
}

//Unrecognised text
UnknownAction = [$A-Z]i([^\n\r\u000b.;“] / QuotedSection)* {
	return {name: 'unknown', text: text()}
}

UnknownFragment = _ ([^\n\r\u000b.;“] / QuotedSection)+ {
	return {name: 'unknown', text: text()}
}

//Actions
ActionList = item:SingleAction items:(_ ([.;]/And)? _ u:SingleSubsequentAction  {return u;})* _ ReminderText? [.;]? {
	return flattenArrays([item, ...items].map((action) => {
		if(action.targetPlayer === 'any') //Player actions that affect all players get split into 1 per player
			return [ //This doesn't deep copy, not sure if that will be a problem.
				Object.assign({}, action, {targetPlayer:'self'}),
				Object.assign({}, action, {targetPlayer:'opponent'})
			]
		return action
	}))
}

SentenceActionList = item:SingleAction items:(And? _ u:SingleSubsequentAction  {return u;})* [.;]? {
	return flattenArrays([item, ...items].map((action) => {
		if(action.targetPlayer === 'any') //Player actions that affect all players get split into 1 per player
			return [ //This doesn't deep copy, not sure if that will be a problem.
				Object.assign({}, action, {targetPlayer:'self'}),
				Object.assign({}, action, {targetPlayer:'opponent'})
			]
		return action
	}))
}

//TODO: Move time limited effects to the front to support permission effects (e.g. "you may play a non-logos card" )
//so wording doesn't overlap with the "optional" check.
SingleAction = _ condition:IfCondition? _ optional:"You may"i? _ effect:(
MoveCardAction / PlayerAction / CardAction / MoveAmberAction
/ TimeLimitedEffect / ChooseTarget / UnknownAction)
condition2:IfCondition? {
	let extras = {
    	optional: optional != null,
        condition: condition || condition2
    }
    return Object.assign(effect, extras)
}

ChooseTarget = "Choose a house"i {return {"target": {"mode": "house"}}}
	/"Choose"i _ target:StandardCardTarget {return {target}}

SingleSubsequentAction = then:ThenCondition? _ effect:SingleAction {
    return Object.assign(effect, then)
}

ThenCondition = condition:(
	"If" _ ("you"/"they") _ "do,"i {return null}/
//    "Otherwise,"i {return {name:"otherwise"}}/ Otherwise is actually a huge pain to implement
    "If this damage destroys that creature,"i {return {name:"destroysTarget"};}) {
    return {
    	then: true,
        condition
    }
}/condition:("If it is not destroyed,"i {return {name:"not", condition:{name:"destroysTarget"}};}) {
    return {
    	then: false,
        condition
    }
}

//Player actions section - for actions that target players
PlayerAction = targetPlayer:PlayerTarget? _ effect:SinglePlayerAction _ multiplier:Multiplier? {
	let info = {multiplier};
	if (targetPlayer) info.targetPlayer = targetPlayer;
	return Object.assign(effect, info);
}

//TODO: Add list support.
SinglePlayerAction = Forge / AmberAction / GainChains / DrawCards / DiscardRandomCards / RaiseTide

Forge = "forge a key at current cost"i {
	return {name: 'forgeKey'}
}

AmberAction = type:AmberActionType _ amount:AmberCount {
	return {name: type, amount}
}

AmberActionType = "Gain"i "s"? { return 'gainAmber';}
	/"Give"i "s"? _ PlayerTarget _ { return 'transferAmber'; }
	/"Steal"i "s"? { return 'steal'; }
	/"Capture"i "s"? { return 'capture'; }
	/"Lose"i "s"? {	return 'loseAmber'; }

AmberCount = amount:Number ("<A>"/"A") { return amount; }
	/("all of it"/("each"/"all of" _ PlayerTarget) _ ("<A>"/"A")) {return "all"; }

DrawCards = "Draw"i "s"? _ amount:Number _ ("cards"/"card") {
	return {name: 'draw', amount}
}

DiscardRandomCards = "Discard"i "s"? _ amount:Number _ "random card"i "s"? _ "from" _ PlayerTarget _ "hand" {
	return {name: 'discardAtRandom', amount	};
}

GainChains = "Gain"i "s"? _ amount:Number _ "chain"i "s"? {
	return {name: 'gainChains', amount}
}

RaiseTide = "Raise"i "s"? _ "the tide" {
	return {name: 'raiseTide'}
}

//Card effects
CardAction = StandardFormatCardAction/CardCapturesAction/GiveCounters

StandardFormatCardAction = actions:CardActionList _ target:GeneralCardTarget
_ multiplier:Multiplier? _ splash:SplashSuffix?_ ignoreArmor:UnpreventableSuffix? _ AsIfItWereYours? {
	let action = actions.length === 1 ? actions[0] : {name:"sequential", actions}
	return Object.assign(action, {target, splash, multiplier, ignoreArmor})
}

CardActionList = item:SingleCardAction items:(_ And _ e:SingleCardAction {return e;})* {
	return [item, ...items]
}

//Unusual formats
CardCapturesAction = target:GeneralCardTarget _ "Captures"i _ amount:AmberCount
	_ hypnosis:("from" _ ("its"/"their") _"own side")? {
	let player = null;
	if(hypnosis != null)
		player = 'opponent';
	if(target.mode == 'trigger')
		player = 'controllerOpponent'
	return {
		name: 'capture',
		amount,
		target,
		player
    }; //TODO: Update so this splits by current controller, then either sets self or opponent as the player to target? UNLESS an arbitrary creature triggers it.
}

GiveCounters = "give"i _ target:GeneralCardTarget _ amount:Number _ "+1 power counter" "s"? _ multiplier:Multiplier? _ ReminderText? {
	return {name: 'addPowerCounter', amount, target, multiplier};
}

//Standard formats
SingleCardAction = DealDamage / Ready / Use / Fight / Reap / Destroy / Sacrifice / Purge
	/ Exalt / Ward / RemoveWard / Enrage / Stun / Unstun / Exhaust / ArchiveTarget
	/ Heal / FullyHeal / MayFight / PutCounters / RemoveCounters

DealDamage = "Deal"i _ amount:Number ("<D>"/"D") _ "to" {return {name: 'dealDamage', amount}}
SplashSuffix = ", with" _ amount:Number ("<D>"/"D") _ "splash" {return amount; }
UnpreventableSuffix = ". This damage cannot be prevented by armor."i { return true; }

Use = "Use"i {return {name: 'use'}}
AsIfItWereYours = "as if it were yours"

PutCounters = "Put"i _ amount:Number _ "+1 power counter" "s"? _ "on" {
	return  {name: 'addPowerCounter', amount}
}

RemoveCounters = "Remove"i _ amount:Number _ "+1 power counter" "s"? _ "from" {
	return  {name: 'removePowerCounter', amount}
}

Ready = "Ready"i {return {name: 'ready'}}
Fight = "fight with"i {return {name: 'fight'}}
Reap = "reap with"i {return {name: 'reap'}}
Destroy = "Destroy"i {return {name: 'destroy'}}
Sacrifice = "Sacrifice"i {return {name: 'sacrifice'}}
Purge = "Purge"i {return {name: 'purge'}}
Exalt = "Exalt"i {return {name: 'exalt', amount:1 }}
Ward = "Ward"i {return {name: 'ward'}}
RemoveWard = "Remove a ward from"i {return {name: 'removeWard'}}
Enrage = "Enrage"i {return {name: 'enrage'}}
Stun = "Stun"i {return {name: 'stun'}}
Unstun = "Unstun"i {return {name: 'removeStun'}}
Exhaust = "Exhaust"i {return {name: 'exhaust'}}
ArchiveTarget = "Archive"i {return {name: 'archive'}}
Heal = "heal"i _ amount:Number _ "damage from" {return {name: 'heal', amount }}
FullyHeal = "Fully heal"i {	return {name: 'heal', fully: true }}

//Card movement effects - these are worded in more complex ways than other card-related effects.
MoveCardAction = controller:PlayerTarget? _ name:MoveCardActionType _ target:GeneralCardTarget _
	location:("from" _ l:SpecificLocation {return l;})? _
	endLocation:(("to"/"into"/"on") _ l:SpecificLocation {return l;})? {

    //Archiving and discarding default to targetting a card from your hand
    if ((name === "archive" || name == "discard") && !target.location)
		location = location || {location: "hand", controller: "self"};

	if (controller != null)
		target.controller = controller

	if(endLocation != null && endLocation.location === "archives") {
		name = "archive"
		//TODO: Check for archiving opponent's creatures
	}

	return {
    	name,
		target: location != null ? Object.assign(target, location) : target,
    }
}

SpecificLocation = sublocation:SubLocation? _ controller:(PlayerTarget/("an"/"a" {return "any";}))
	_ location:CardLocation {
	return {controller, location};
}

SubLocation = "the"? _ "top of"
MoveCardActionType = "Return"i {return "returnToHand"}
	/"Shuffle"i {return "returnToDeck"}
	/"Put"i {return "returnToDeck"}
	/"Discard"i {return "discard"}
	/"Purge"i {return "purge"}
	/"Archive"i {return "archive"}

CardLocation = "hand"i "s"? {return "hand"}
	/"deck"i "s"? {return "deck"}
	/"discard pile"i "s"? {return "discard"}
	/"archives"i {return "archives"}

//Amber movement effects are also worded in more complex ways
MoveAmberAction = "Move"i _ amount:AmberCount _ ("on"/"from") _ target:GeneralCardTarget _ "to" _
destination:AmberLocation {
	return Object.assign({amount, target}, destination);
}

AmberLocation = "the common supply" {return {name:"removeAmber"}}
/recipient:PlayerTarget _ "pool" {return {name:"returnAmber", recipient}}
/*/GeneralCardTarget {
	return {name:"moveAmber"}
}*/

//Some actions apply an effect for a specific period of time.
TimeLimitedEffect = (duration:Duration "," _ effect:(SinglePersistentEffect/GeneralPersistentTrigger/GeneralDurationTrigger) {
	return {name:duration, durationEffect:effect}
}/effect:SinglePersistentEffect _ duration:Duration {
	return {name:duration, durationEffect:effect}
})

Duration = "For the remainder of the turn"i {return "forRemainderOfTurn"} /
"during your opponent" [’'] "s next turn"i {return "lastingEffect"} //TODO: Correct this, lastingEffect also applies during the current turn

//Persistent effects
//Persistent player effects
SinglePersistentPlayerEffect = KeyCost/CantBeStolen
SpecialPersistentPlayerEffect = ModifyHandSize

KeyCost = "keys cost "i amount:Number ("<A>"/"A") _ multiplier:Multiplier? {
	return {name: "modifyKeyCost", amount, multiplier};
}

CantBeStolen = "A cannot be stolen" {return {name:"playerCannot", effect:"steal"};}

ModifyHandSize = "During" _ ("your"/"their") _ Quote "draw cards" Quote _ "step,"
_ target:("refill your"{return "self"}/t:PlayerTarget _ "refills their" {return t;})
_ "hand to" _ amount:Number  _ "card" "s"? _ multiplier:Multiplier? {
	return {
    	targetPlayer:target || "any",
        effects:[{name: "modifyHandSize", amount, multiplier}]
    };
}

//Persistent card effects, including upgrades
SinglePersistentCardEffect = GetsStats/GainsAbility/EntersPlayAbility/MayBeUsed/PlayRestriction/CannotEffect/LimitFightDamage

//Gets stats
GetsStats = "gets" _ statChanges:StatChangeList _ multiplier:Multiplier? {
	return statChanges.map((s) => Object.assign(s, {multiplier}));
}
StatChangeList = item:SingleStatChange items:(_ And _ e:SingleStatChange {return e;})* {
	return [item, ...items]
}
SingleStatChange = amount:Number _ stat:("power"i/"armor"i){
	return {name: "modify"+ stat.charAt(0).toUpperCase() + stat.slice(1), amount};
}

//Gains abilities
GainsAbility = "gain"i "s"? ","? _ abilities:GainAbilityList {return abilities}
GainAbilityList = items:(e:GainSingleAbility _ And _ {return e;})* _ item:GainSingleAbility {
	return [...items, item]
}
GainSingleAbility = keywords:Keywords _{return Object.assign(keywords, {name: "gainKeywords"});}
	/ Quote ability:BoldAbility Quote {return {name: "gainAbility", ability};}
    / Quote ability:SinglePersistentEffect Quote {return {name: "gainAbility", ability};}
	/ Quote ability:GeneralTrigger Quote {return {name: "gainAbility", ability};}

//Enters play
EntersPlayAbility = "enter" "s"? " play" _ states:CardStateList {
	return states.map((state) => ({name: 'entersPlay' + state.charAt(0).toUpperCase() + state.slice(1)}))
}
CardStateList = items:(i:CardState _ And _ {return i;})* _ item:CardState {
	return [...items, item]
}
CardState = ("stunned"i/"ready"i/"enraged"i/"exhausted"i)

//Other persistent card effects
PlayRestriction = "You can only play this card" _ condition:IfCondition {
	return {name: "cardCannot", effect:"play", condition:{name:"not", condition}}
}
CannotEffect = "cannot" _ effect:("reap"/"fight"/"ready"/"be used" {return "use"}/"be dealt damage" {return "damage"}) {return [{name:"cardCannot", effect}];}
LimitFightDamage = "only deals" _ amount:Number "D when fighting" {return [{name:"limitFightDamage", amount}];}

//Permission effects - work in progress
MayBeUsed = e:(MayFight/MayUse) {return [e]}
MayFight = "may fight" { return {name: 'canFight'}; }
MayUse = "may use" { return {name: 'mayUse'}; }

//Targetting
//Player targetting
PlayerTarget = ("Your Opponent"i ['’s]* {return "opponent"}
	/ "You"i "r"? {return "self"}
	/ ("a player"/"their owner"i ['’s]*/"each player"i ['’s]*/"their"i) {return "any";}
	/ "they"i  {return "they"}
	/ "its owner" ['’s]* {return "owner"}
	/ "its controller" ['’s]* {return "controller"}
	/ "its opponent" ['’s]* {return "controllerOpponent"})

//Card targetting
GeneralCardTarget = (DeckCard/NeighborTarget/Self
/target1:StandardCardTarget _ "and" _ target2:StandardCardTarget {
	if(target1.mode == "all" && target2.mode == "all")
	{
    	var type = target1.type
        if(type != target2.type)
        {
        	target1.conditions.push({name:'type', type:target1.type})
            target2.conditions.push({name:'type', type:target2.type})
            type = null
        }
		return {
			mode: "all",
            controller: target1.controller,
			type,
			conditions: [
				{
					name: "or",
					conditions:[
						{name: "and", conditions: target1.conditions},
						{name: "and", conditions: target2.conditions}
					]
				}
			]
		}
	}
	return {name: "unknown", target1, target2}
}
/StandardCardTarget/ItTarget/UpgradedCreature)

DeckCard = "the top"i _ numCards:Number? _ "card""s"? " of" _ controller:PlayerTarget _ "deck" {
	return {mode:"all", numCards: numCards || 1, location:'deck', controller}
}
Self = "$this" {return {mode: "self"}}
UpgradedCreature = "this creature"i {return {mode: "this"}}
NeighborTarget = "Each of"i? _ ("$this"i/"this creature") [\'’s]* _ house:HouseSpecifier? _ "neighbors" {
	return Object.assign({
		mode:"all",
		type: "creature",
		conditions: [{name: "neighboring"}, house].filter(x => x !== null)
	});
}

ItTarget = ("it"i/"that"i _ CardType) {return {mode: "it"}}

//TODO: Combine most powerful into target count?
StandardCardTarget = targetCount:CardTargetCount  _ minmax:MostPowerful? _
card:ConditionalCardTarget {
	return Object.assign(card, targetCount, minmax || {})
}

ConditionalCardTarget = other:OtherSpecifier?
	_ different:DifferentSpecifier?
	_ damaged:DamagedSpecifier? _ exhausted:ExhaustedSpecifier? _ controller:ControllerSpecifier? _ neighbor:NeighborSpecifier?
	_ flank:FlankSpecifier? _ house:HouseSpecifier? _ stunned:StunnedSpecifier?
	_ ready:ReadySpecifier?
	_ base:BaseCardTarget
	_ nonFlank:NonFlankSpecifier? _ center:CenterSpecifier? _ hasAmber:HasAmberSpecifier?
	_ attached:AttachedToSpecifier? _ chosenHouse:ChosenHouseSpecifier? _ power:PowerSpecifier?
	_ controlledBy:ControlledBySpecifier? {
	return {
    	type: base.type,
        controller: controller || controlledBy,
        conditions: [other, different, damaged, neighbor, flank, nonFlank, stunned, ready, exhausted, center, house, hasAmber, attached, chosenHouse, power].concat(base.conditions).filter(x => x !== null)
	}
}

//The core card target - need to at least specify a card type or a trait that implies a card type
BaseCardTarget = trait:TraitSpecifier? _ house:HouseSpecifier? _ type:CardType {return{type, conditions:[trait, house]};} /
	t:TraitSpecifier {return{conditions:[t], type:null};}

//How many targets?
CardTargetCount = count:(EachTarget / OneTarget / UpToTargets / NoTargets / AtLeastTargets / NumberTargets)? 	{return count || {mode: "all"};}

MostPowerful = cardStat:(
	"most" {return {name: "power"};}
	/"least" {return {name:"negative", quantity:{name: "power"}};}) _ "powerful" {
	return { mode: "mostStat", cardStat	}
}

EachTarget = ("each"i/"all"i) {return {mode: "all"}}
NoTargets = ("no"i) {return {mode:"exactly", count:0}}
OneTarget = ("an"i / "a"i / "the"i) {return {mode:"exactly", count:1}}
NumberTargets = count:Number {return {mode:"exactly", count}}
UpToTargets = "up to"i _ count:Number {return {mode:"upTo", count}}
AtLeastTargets = count:Number _ "or more" {return {mode:"atLeast", count}}

//Conditions before card
OtherSpecifier = "other" {return {name: "other"};}
DifferentSpecifier = "different" {return {name: "different"};}
FlankSpecifier = "flank"i {	return {name: "flank"};}
StunnedSpecifier = "stunned"i {	return {name: "stunned"};}
ExhaustedSpecifier = "exhausted"i {	return {name: "exhausted"};}
ReadySpecifier = "ready"i {	return {name: "not", condition: {name: "exhausted"}};}
NeighborSpecifier = "neighboring"i {return {name: "neighboring"};}


DamagedSpecifier = negate:"un"i? "damaged" {
	let c = {name: "damaged"};
	return negate != null ? {name: "not", condition: c} : c;
}

TraitSpecifier = negate:"non-"i? trait:Trait {
	let c = {name: "trait", trait: trait.toLowerCase()}
    return negate != null ? {name: "not", condition: c} : c;
}

HouseSpecifier = negate:"non-"i? house:House {
	let c = {name: "house", house: house.toLowerCase()};
	return negate != null ? {name: "not", condition: c} : c;
}

ControllerSpecifier = (("friendly"i/"your"i) {return "self";}
	/ ("enemy"i/"opponent" [’'] "s"i) {return "opponent";})

//Conditions after card
ControlledBySpecifier = "controlled by any player" {return null;}

NonFlankSpecifier = "that is"? _ "not on a flank"i {
	return {name: "not", condition: {name: "flank"}}
}

CenterSpecifier = "in the center of its controller" [’'] "s battleline."i {
	return {name: "center"}
}

PowerSpecifier = "with power" _ amount:Number _ "or" _ compare:("lower"/"higher") {
	return {
		name: "comparison",
		operator: compare == "lower" ? "<=" : ">=",
		a: { name: "power" },
		b: { name: "constant", amount}}
}

HasAmberSpecifier = "with" _ negate:"no"? _ "A on it"  {
	let c = {name: "hasAmber"};
	return negate != null ? {name: "not", condition: c} : c;
}

AttachedToSpecifier = ("attached to"/"on") _ target:GeneralCardTarget  {
	return {name: "attached", target};
}

ChosenHouseSpecifier = "of that house" {return {name: "chosenHouse"};}

//Conditions
IfCondition = "If"i _ c:Condition ","? {return c;}
WhileCondition = "While"i _ c:Condition ","? {return c;}

Condition = c:(
	AmberComparison /
	CreatureComparison /
	"it is not your turn"i {return {name:"activePlayer", player:"opponent"}} /
	CardEventCountComparison /
	"it is your turn"i {return {name:"activePlayer", player:"self"}}/
	"the tide is high"i {return {name:"isTideHigh"}}/
	"the tide is low"i {return {name:"isTideLow"}}/
	CardCountComparison /
	card:GeneralCardTarget _ "is in the center of your battleline"i
	{return {name:"check", card, condition:{name:"center"}}})
	{return c;}

AmberComparison = player:PlayerTarget _ ("has"i/"have"i) _ amount:Number ("A"/"<A>")_
"or" _ comparison:("more"/"less") {
	return {
    	name: "comparison",
        operator: ">=",
        a:{name:"amber", player},
        b:{name:"constant", amount}
    }
}

CreatureComparison = a:PlayerTarget _ "control" "s"? _ "more creatures than"i _ b:PlayerTarget {
	return {
    	name: "comparison",
        operator: ">",
        a:{name:"cards", type:'creature', controller:a},
        b:{name:"cards", type:'creature', controller:b}
    }
}

CardCountComparison = "there are"i _ comparison:NumberComparison _
	card:ConditionalCardTarget _ "in play"? "," {
	return Object.assign(comparison, {
    	a:Object.assign({name:"cards"},card)
    })
}

CardEventCountComparison = comparison:NumberComparison _ card:ConditionalCardTarget _ ("was"/"were"/"has been"/"have been") _ action:("destroyed" {return "onCardDestroyed"}) _ "this turn"i{
    return Object.assign(comparison, {
    	a:{name:"eventCount", action, card}
    })
}
	/eventPlayer:PlayerTarget _ action:("played" {return "play";}) _ comparison:NumberComparison _ card:ConditionalCardTarget _ "this turn" {
    return Object.assign(comparison, {
    	a:{name:"eventCount", eventPlayer, action, card}
    })
}
    /eventPlayer:PlayerTarget _ "have used" _ comparison:NumberComparison _ card:ConditionalCardTarget _ action:("to fight"{return "onFight";}) _ "this turn" {
    return Object.assign(comparison, {
    	a:{name:"eventCount", eventPlayer, action, card}
    })
}

CardEventCount = "each" _ card:ConditionalCardTarget _ eventPlayer:PlayerTarget _ action:("have"? _ "played" {return "play";}) _ "this turn" {
    return {name:"eventCount", eventPlayer, action, card}
}

NumberComparison = operator:("exactly" {return "===";})? _ amount:Number
	_ operator2:("or more" {return ">="})? {
	return {
    	name: "comparison",
        operator: operator || operator2 || (amount == 0 ? "===" : ">="),
        b: {name:"constant", amount}
    }
}

// Modifiers
Multiplier = "once"? _ "For"i _ t:(
	CardEventCount
	/KeyCount
	/CurrentAmberCount
	/NeighborCount //This is actually just a subset of card counting multipliers
	/TriggerMultiplier
	/CardCount) {
    return t
}

TriggerMultiplier = "each" _ card:ConditionalCardTarget _ trigger:(
	"healed this way" {return "healedThisWay"}
	/"destroyed this way" {return "destroyedThisWay"}
	/"exhausted this way" {return "exhaustedThisWay"}) {
	return {name:trigger, card}
}

KeyCount = "each" _ not:"un"? _"forged key" _ player:PlayerTarget _ ("have"/"has") {
	let q = {name: "keyCount", player}
	return not !== null
		? {name:"operator", operator:"-", a:{name:"constant", amount:3}, b:q}
		: q
}

CurrentAmberCount = "each A in" _ player:PlayerTarget _ "pool" {
	return {name: "amberCount", player};
}

CardCount = "each"i _ card:ConditionalCardTarget {return Object.assign({name:"cards"}, card);}
NeighborCount = "each neighbor it has" {return {name:"cards", type: "creature", conditions: [{name: "neighboring"}]};}
/target:NeighborTarget {return Object.assign({name:"cards"}, target);}

//Descriptors
House = ("brobnar"i / "dis"i / "logos"i / "mars"i / "sanctum"i / "shadows"i / "untamed"i
	/ "saurian"i / "star alliance"i / "unfathomable"i) {
	return text().replace(" ", "");
}

//Creature traits only - split if artifact traits are needed.
Trait = "mutant"i / "shard"i / "cat"i / "beast"i / "agent"i / "human"i / "scientist"i
	/ "giant"i / "demon"i / "knight"i / "dinosaur"i / "thief"i / "martian"i / "robot"i
	/ "sin"i / "aquan"i / "horseman"i {return text().toLowerCase();}

CardType = "action"i _ "card"? "s"? {return "action";}
	/ "artifact"i _ "card"? "s"? {return "artifact";}
	/ "creature"i _ "card"? "s"? {return "creature";}
	/ "upgrade"i _ "card"? "s"? {return "upgrade";}
	/ "card"i "s"? {return null;}

//Basics
Number = n:(("no") {return 0;} / ("an"/"a"/"one of"/"one") {return 1;} / "two" {return 2;} / "three" {return 3;} / Integer)
	_ sign:("additional" {return 1;}/"less" {return -1;})? { return n*(sign || 1);}

Integer = sign:[+\-–]? number:[0-9]+ {
	return sign == '-' || sign == '–' ? -parseInt(number.join("")): parseInt(number.join(""));
}

_ "whitespace" = [  ﻿\u202f]*

Quote = [\“"”]
QuotedSection = Quote [^”“]+ Quote

/* Pattern - matching comma/and/or based lists:
ThingList = item:Thing items:(_ And _ e:Thing {return e;})* {
	return [item, ...items]
}
*/
And = ("," _ "and"/"and,"/"and"/",")
Or = ("," _ "or"/"or,"/"or"/",")
