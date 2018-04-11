const _ = require('underscore');

const AbilityLimit = require('./abilitylimit.js');
const CostReducer = require('./costreducer.js');
const PlayableLocation = require('./playablelocation.js');
const CannotRestriction = require('./cannotrestriction.js');
const ImmunityRestriction = require('./immunityrestriction.js');

function cardCannotEffect(type) {
    return function(predicate) {
        let restriction = new CannotRestriction(type, predicate);
        return {
            apply: function(card) {
                card.addAbilityRestriction(restriction);
            },
            unapply: function(card) {
                card.removeAbilityRestriction(restriction);
            }
        };
    };
}

function playerCannotEffect(type) {
    return function(predicate) {
        let restriction = new CannotRestriction(type, predicate);
        return {
            apply: function(player) {
                player.abilityRestrictions.push(restriction);
            },
            unapply: function(player) {
                player.abilityRestrictions = _.reject(player.abilityRestrictions, r => r === restriction);
            }
        };
    };
}

const Effects = {
    all: function(effects) {
        return {
            apply: function(card, context) {
                _.each(effects, effect => effect.apply(card, context));
            },
            reapply: function(card, context) {
                let stateChanged = false;
                _.each(effects, effect => {
                    if(effect.reapply) {
                        stateChanged = effect.reapply(card, context) || stateChanged;
                    }
                });
                return stateChanged;
            },
            unapply: function(card, context) {
                _.each(effects, effect => effect.unapply(card, context));
            },
            reapplyOnCheckState: true
        };
    },
    cannotBeDeclaredAsAttacker: cardCannotEffect('declareAsAttacker'),
    cannotBeDeclaredAsDefender: cardCannotEffect('declareAsDefender'),
    cannotParticipateAsAttacker: cardCannotEffect('participateAsAttacker'),
    cannotParticipateAsDefender: cardCannotEffect('participateAsDefender'),
    doesNotBowAsAttacker: function () {
        return {
            apply: function(card) {
                card.conflictOptions.doesNotBowAs.attacker = true;
            },
            unapply: function(card) {
                card.conflictOptions.doesNotBowAs.attacker = false;
            },
            reapplyOnCheckState: true
        };
    },
    doesNotBowAsDefender: function () {
        return {
            apply: function(card) {
                card.conflictOptions.doesNotBowAs.defender = true;
            },
            unapply: function(card) {
                card.conflictOptions.doesNotBowAs.defender = false;
            },
            reapplyOnCheckState: true
        };
    },
    doesNotReadyDuringRegroup: function () {
        return {
            apply: function(card) {
                card.readysDuringReadying = false;
            },
            unapply: function(card) {
                card.readysDuringReadying = true;
            },
            reapplyOnCheckState: true
        };
    },
    modifyMilitarySkill: function(value) {
        return {
            apply: function(card) {
                card.modifyMilitarySkill(value, true);
            },
            unapply: function(card) {
                card.modifyMilitarySkill(-value, false);
            }
        };
    },
    modifyPoliticalSkill: function(value) {
        return {
            apply: function(card) {
                card.modifyPoliticalSkill(value, true);
            },
            unapply: function(card) {
                card.modifyPoliticalSkill(-value, false);
            }
        };
    },
    modifyBaseMilitarySkill: function(value) {
        return {
            apply: function(card) {
                card.modifyBaseMilitarySkill(value, true);
            },
            unapply: function(card) {
                card.modifyBaseMilitarySkill(-value, false);
            }
        };
    },
    modifyBasePoliticalSkill: function(value) {
        return {
            apply: function(card) {
                card.modifyBasePoliticalSkill(value, true);
            },
            unapply: function(card) {
                card.modifyBasePoliticalSkill(-value, false);
            }
        };
    },
    modifyMilitarySkillMultiplier: function(value) {
        return {
            apply: function(card) {
                card.modifyMilitarySkillMultiplier(value, true);
            },
            unapply: function(card) {
                card.modifyMilitarySkillMultiplier(1.0 / value, false);
            }
        };
    },
    modifyPoliticalSkillMultiplier: function(value) {
        return {
            apply: function(card) {
                card.modifyPoliticalSkillMultiplier(value, true);
            },
            unapply: function(card) {
                card.modifyPoliticalSkillMultiplier(1.0 / value, false);
            }
        };
    },
    modifyGlory: function(value) {
        return {
            apply: function(card) {
                card.modifyGlory(value, true);
            },
            unapply: function(card) {
                card.modifyGlory(-value, false);
            }
        };
    },
    modifyProvinceStrength: function(value) {
        return {
            apply: function(card) {
                card.modifyProvinceStrength(value, true);
            },
            unapply: function(card) {
                card.modifyProvinceStrength(-value, false);
            }
        };
    },
    dynamicMilitarySkill: function(calculate) {
        return {
            apply: function(card, context) {
                context.dynamicMilitarySkill = context.dynamicMilitarySkill || {};
                context.dynamicMilitarySkill[card.uuid] = calculate(card, context) || 0;
                card.modifyMilitarySkill(context.dynamicMilitarySkill[card.uuid], true);
            },
            reapply: function(card, context) {
                let currentMilitarySkill = context.dynamicMilitarySkill[card.uuid];
                let newMilitarySkill = calculate(card, context) || 0;
                context.dynamicMilitarySkill[card.uuid] = newMilitarySkill;
                card.modifyMilitarySkill(newMilitarySkill - currentMilitarySkill, true);
                return (newMilitarySkill - currentMilitarySkill) !== 0;
            },
            unapply: function(card, context) {
                card.modifyMilitarySkill(-context.dynamicMilitarySkill[card.uuid], false);
                delete context.dynamicMilitarySkill[card.uuid];
            }
        };
    },
    dynamicPoliticalSkill: function(calculate) {
        return {
            apply: function(card, context) {
                context.dynamicPoliticalSkill = context.dynamicPoliticalSkill || {};
                context.dynamicPoliticalSkill[card.uuid] = calculate(card, context) || 0;
                card.modifyPoliticalSkill(context.dynamicPoliticalSkill[card.uuid], true);
            },
            reapply: function(card, context) {
                let currentPoliticalSkill = context.dynamicPoliticalSkill[card.uuid];
                let newPoliticalSkill = calculate(card, context) || 0;
                context.dynamicPoliticalSkill[card.uuid] = newPoliticalSkill;
                card.modifyPoliticalSkill(newPoliticalSkill - currentPoliticalSkill, true);
                return (newPoliticalSkill - currentPoliticalSkill) !== 0;
            },
            unapply: function(card, context) {
                card.modifyPoliticalSkill(-context.dynamicPoliticalSkill[card.uuid], false);
                delete context.dynamicPoliticalSkill[card.uuid];
            }
        };
    },
    delayedEffect: function(properties) {
        return {
            apply: function(card, context) {
                properties.target = card;
                properties.context = properties.context || context;
                context.delayedEffect = context.delayedEffect || {};
                context.delayedEffect[card.uuid] = context.source.delayedEffect(properties);
            },
            unapply: function(card, context) {
                context.game.effectEngine.removeDelayedEffect(context.delayedEffect[card.uuid]);
                delete context.delayedEffect[card.uuid];
            }
        };
    },
    terminalCondition: function(properties) {
        return {
            apply: function(card, context) {
                properties.target = card;
                properties.context = properties.context || context;
                context.terminalCondition = context.terminalCondition || {};
                context.terminalCondition[card.uuid] = context.source.terminalCondition(properties);                
            },
            unapply: function(card, context) {
                context.game.effectEngine.removeTerminalCondition(context.terminalCondition[card.uuid]);
                delete context.terminalCondition[card.uuid];
            }
        };
    },
    addKeyword: function(keyword) {
        return {
            apply: function(card) {
                card.addKeyword(keyword);
            },
            unapply: function(card) {
                card.removeKeyword(keyword);
            }
        };
    },
    removeKeyword: function(keyword) {
        return {
            apply: function(card) {
                card.removeKeyword(keyword);
            },
            unapply: function(card) {
                card.addKeyword(keyword);
            }
        };
    },
    addMultipleKeywords: function(keywords) {
        return {
            apply: function(card) {
                _.each(keywords, keyword => card.addKeyword(keyword));
            },
            unapply: function(card) {
                _.each(keywords, keyword => card.removeKeyword(keyword));
            }
        };
    },
    removeAllKeywords: function() {
        return [
            this.removeKeyword('ancestral'),
            this.removeKeyword('restricted'),
            this.removeKeyword('limited'),
            this.removeKeyword('sincerity'),
            this.removeKeyword('pride'),
            this.removeKeyword('covert')
        ];
    },
    addTrait: function(trait) {
        return {
            apply: function(card) {
                card.addTrait(trait);
            },
            unapply: function(card) {
                card.removeTrait(trait);
            }
        };
    },
    addFaction: function(faction) {
        return {
            apply: function(card) {
                card.addFaction(faction);
            },
            unapply: function(card) {
                card.removeFaction(faction);
            }
        };
    },
    addConflictElement: function(element) {
        return {
            apply: function(card, context) {
                context.game.currentConflict.addElement(element);
            },
            unapply: function(card, context) {
                if(context.game.currentConflict) {
                    context.game.currentConflict.removeElement(element);
                }
            }
        };
    },
    modifyConflictElementsToResolve: function(amount) {
        return {
            apply: function(card, context) {
                context.game.currentConflict.modifyElementsToResolve(amount);
            },
            unapply: function(card, context) {
                if(context.game.currentConflict) {
                    context.game.currentConflict.modifyElementsToResolve(-amount);
                }
            }
        };
    },
    blank: {
        apply: function(card) {
            card.setBlank();
        },
        unapply: function(card) {
            card.clearBlank();
        }
    },
    immuneTo: function(condition) {
        let restriction = new ImmunityRestriction(condition);
        return {
            apply: function(card) {
                card.addAbilityRestriction(restriction);
            },
            unapply: function(card) {
                card.removeAbilityRestriction(restriction);
            }
        };
    },
    takeControl: function(newController) {
        return {
            apply: function(card, context) {
                context.takeControl = context.takeControl || {};
                context.takeControl[card.uuid] = { originalController: card.controller };
                context.game.takeControl(newController, card);
                context.game.addMessage('{0} uses {1} to take control of {2}', context.source.controller, context.source, card);
            },
            unapply: function(card, context) {
                context.game.takeControl(context.takeControl[card.uuid].originalController, card);
                delete context.takeControl[card.uuid];
            }
        };
    },
    addRingEffect: function(effectType, effectFunc) {
        return {
            apply: function(ring) {
                ring.addEffect(effectType, effectFunc);
            },
            unapply: function(ring) {
                ring.removeEffect(effectType, effectFunc);
            }
        };
    },
    cannotBeDiscarded: cardCannotEffect('discardFromPlay'),
    cannotRemoveFate: cardCannotEffect('removeFate'),
    cannotPlay: playerCannotEffect('play'),
    cardCannotTriggerAbilities: cardCannotEffect('triggerAbilities'),
    cannotBeTargeted: cardCannotEffect('target'),
    cannotBeBowed: cardCannotEffect('bow'),
    cannotBeBroken: cardCannotEffect('break'),
    cannotBeMovedIntoConflict: cardCannotEffect('moveToConflict'),
    cannotBeSentHome: cardCannotEffect('sendHome'),
    cannotBeDishonored: cardCannotEffect('dishonor'),
    cannotMoveCharactersIntoConflict: playerCannotEffect('moveToConflict'),
    cannotCountForResolution: cardCannotEffect('countForResolution'),
    cannotBeAffectedByHonor: cardCannotEffect('affectedByHonor'),
    playerCannotTriggerAbilities: playerCannotEffect('triggerAbilities'),
    cannotBecomeDishonored: cardCannotEffect('becomeDishonored'),
    playerCannotInitiateConflict: playerCannotEffect('initiateConflict'),
    cardCannotInitiateConflict: cardCannotEffect('initiateConflict'),
    cardCannotPlaceFate: cardCannotEffect('placeFate'),
    cannotPlaceFateWhenPlayingCharacter: playerCannotEffect('placeFateWhenPlayingCharacter'),
    playerCannotSpendFate: playerCannotEffect('spendFate'),
    playerCannotTakeFirstAction: playerCannotEffect('takeFirstAction'),
    playerCannotTakeFateFromRings: playerCannotEffect('takeFateFromRings'),
    playerCannotChooseConflictRing: playerCannotEffect('chooseConflictRing'),
    changePlayerGloryModifier: function(amount) {
        return {
            apply: function(player) {
                player.changeGloryModifier(amount);
            },
            unapply: function(player) {
                player.changeGloryModifier(-amount);
            }
        };
    },
    changeConflictSkillFunction: function(func) {
        return {
            apply: function (card, context) {
                if(context.game.currentConflict) {
                    context.game.currentConflict.skillFunction = func;
                }
            },
            unapply: function (card, context) {
                if(context.game.currentConflict) {
                    context.game.currentConflict.resetSkillFunction();
                }
            },
            reapplyOnCheckState: true
        };
    },
    gainAbility: function(abilityType, properties) {
        return {
            apply: function(card, context) {
                abilityType = abilityType === 'cancelinterrupt' ? 'interrupt' : abilityType;
                abilityType = abilityType === 'forcedinterrupt' ? 'forcedInterrupt' : abilityType;
                abilityType = abilityType === 'forcedreaction' ? 'forcedReaction' : abilityType;
                card[abilityType](properties);
                let ability = _.last(card.abilities[abilityType === 'action' ? 'actions' : 'reactions']);
                if(abilityType !== 'action') {
                    ability.registerEvents();
                }
                if(context.source.grantedAbilityLimits[card.uuid]) {
                    ability.limit = context.source.grantedAbilityLimits[card.uuid];
                } else {
                    context.source.grantedAbilityLimits[card.uuid] = ability.limit;
                }
                context.gainAbility = context.gainAbility || {};
                context.gainAbility[card.uuid] = ability;
            },
            unapply: function(card, context) {
                if(context.gainAbility && context.gainAbility[card.uuid]) {
                    let list = abilityType === 'action' ? 'actions' : 'reactions';
                    if(abilityType !== 'action') {
                        context.gainAbility[card.uuid].unregisterEvents();
                    }
                    card.abilities[list] = _.reject(card.abilities[list], ability => ability === context.gainAbility[card.uuid]);
                    delete context.gainAbility[card.uuid];
                }
            }
        };
    },
    makeTopCardOfConflictDeckPlayable: function() {
        return {
            apply: function(player, context) {
                player.conflictDeckTopCardHidden = false;
                context.newPlayableLocation = player.addPlayableLocation('play', 'conflict deck');
                let topCard = player.conflictDeck.first();
                if(topCard && topCard.type === 'event') {
                    _.each(topCard.abilities.reactions, reaction => reaction.registerEvents());
                }
            },
            unapply: function(player, context) {
                player.conflictDeckTopCardHidden = true;
                player.playableLocations = _.reject(player.playableLocations, location => location === context.newPlayableLocation);
                delete context.newPlayableLocation;
            },
            reapplyOnCheckState: true
        };
    },
    contributeToConflict: function() {
        return {
            apply: function(card, context) {
                context.attackingModifier = context.attackingModifier || {};
                context.defendingModifier = context.defendingModifier || {};
                if(context.game.currentConflict) {
                    const conflict = context.game.currentConflict;
                    const skill = conflict.skillFunction(card) || 0;
                    if(card.controller.isAttackingPlayer()) {
                        context.attackingModifier[card.uuid] = skill;
                        conflict.modifyAttackerSkill(skill);
                    } else {
                        context.defendingModifier[card.uuid] = skill;
                        conflict.modifyDefenderSkill(skill);
                    }
                }
            },
            reapply: function(card, context) {
                if(context.game.currentConflict) {
                    const conflict = context.game.currentConflict;
                    const skill = conflict.skillFunction(card) || 0;
                    if(card.controller.isAttackingPlayer()) {
                        if(context.defendingModifier[card.uuid]) {
                            conflict.modifyDefenderSkill(-context.defendingModifier[card.uuid]);
                            delete context.defendingModifier[card.uuid];
                        }
                        let skillDifference = skill - (context.attackingModifier[card.uuid] || 0);
                        conflict.modifyAttackerSkill(skillDifference);
                        context.attackingModifier[card.uuid] = skill;
                        return skillDifference !== 0;
                    }
                    if(context.attackingModifier[card.uuid]) {
                        conflict.modifyAttackerSkill(-context.attackingModifier[card.uuid]);
                        delete context.attackingModifier[card.uuid];
                    }
                    let skillDifference = skill - (context.defendingModifier[card.uuid] || 0);
                    conflict.modifyDefenderSkill(skillDifference);
                    context.defendingModifier[card.uuid] = skill;
                    return skillDifference !== 0;
                }
                return false;
            },
            unapply: function(card, context) {
                if(context.attackingModifier[card.uuid]) {
                    if(context.game.currentConflict) {
                        context.game.currentConflict.modifyAttackerSkill(-context.attackingModifier[card.uuid]);
                    }
                    delete context.attackingModifier[card.uuid];
                } else if(context.defendingModifier[card.uuid]) {
                    if(context.game.currentConflict) {
                        context.game.currentConflict.modifyDefenderSkill(-context.defendingModifier[card.uuid]);
                    }
                    delete context.defendingModifier[card.uuid];
                }
            }
        };
    },
    restrictNumberOfDefenders: function(amount) {
        return {
            apply: function(card, context) {
                if(context.game.currentConflict) {
                    if(context.game.currentConflict.maxAllowedDefenders > -1) {
                        context.game.currentConflict.maxAllowedDefenders = Math.min(amount, context.game.currentConflict.maxAllowedDefenders);
                    } else {
                        context.game.currentConflict.maxAllowedDefenders = amount;
                    }
                }
            },
            unapply: function(card, context) {
                if(context.game.currentConflict) {
                    context.game.currentConflict.maxAllowedDefenders = -1;
                }
            },
            reapplyOnCheckState: true
        };
    },
    removeAction: function(action) {
        return {
            apply: function(card, context) {
                context.removeAction = context.removeAction || {};
                context.removeAction[card.uuid] = action;
            },
            unapply: function(card, context) {
                if(context.removeAction && context.removeAction[card.uuid]) {
                    context.removeAction[card.uuid].unregisterEvents();
                    card.abilities.actions = _.reject(card.abilities.actions, ability => ability === context.removeAction[card.uuid]);
                    delete context.removeAction[card.uuid];
                }
            }
        };
    },
    removeReaction: function(reaction) {
        return {
            apply: function(card, context) {
                context.removeReaction = context.removeReaction || {};
                context.removeReaction[card.uuid] = reaction;
            },
            unapply: function(card, context) {
                if(context.removeReaction && context.removeReaction[card.uuid]) {
                    context.removeReaction[card.uuid].unregisterEvents();
                    card.abilities.reactions = _.reject(card.abilities.reactions, ability => ability === context.removeReaction[card.uuid]);
                    delete context.removeReaction[card.uuid];
                }
            }
        };
    },
    increaseLimitOnAbilities: function(amount) {
        return {
            apply: function(card, context) {
                context.increaseLimitOnAbilities = context.increaseLimitOnAbilities || {};
                context.increaseLimitOnAbilities[card.uuid] = _.union(card.abilities.actions, card.abilities.reactions);
                _.each(context.increaseLimitOnAbilities[card.uuid], ability => {
                    if(ability.limit) {
                        ability.limit.modifyMax(amount);
                    }
                });
            },
            unapply: function(card, context) {
                _.each(context.increaseLimitOnAbilities[card.uuid], ability => {
                    if(ability.limit) {
                        ability.limit.modifyMax(-amount);
                    }
                });
                delete context.increaseLimitOnAbilities[card.uuid];
            },
            reapplyOnCheckState: true
        };
    },
    canPlayFromOwn: function(location) {
        return {
            apply: function(player, context) {
                let playableLocation = new PlayableLocation('play', player, location);
                context.canPlayFromOwn = playableLocation;
                player.playableLocations.push(playableLocation);
            },
            unapply: function(player, context) {
                player.playableLocations = _.reject(player.playableLocations, l => l === context.canPlayFromOwn);
                delete context.canPlayFromOwn;
            }
        };
    },
    reduceCost: function(properties) {
        return {
            apply: function(player, context) {
                context.reducers = context.reducers || [];
                var reducer = new CostReducer(context.game, context.source, properties);
                context.reducers.push(reducer);
                player.addCostReducer(reducer);
            },
            unapply: function(player, context) {
                if(context.reducers.length > 0) {
                    _.each(context.reducers, reducer => player.removeCostReducer(reducer));
                }
            }
        };
    },
    reduceNextCardCost: function(playingTypes, amount, match) {
        return this.reduceCost({
            playingTypes: playingTypes,
            amount: amount,
            match: match,
            limit: AbilityLimit.fixed(1)
        });
    },
    reduceNextPlayedCardCost: function(amount, match) {
        return this.reduceNextCardCost('play', amount, match);
    },
    reduceFirstCardCostEachRound: function(playingTypes, amount, match) {
        return this.reduceCost({
            playingTypes: playingTypes,
            amount: amount,
            match: match,
            limit: AbilityLimit.perRound(1)
        });
    },
    reduceFirstPlayedCardCostEachRound: function(amount, match) {
        return this.reduceFirstCardCostEachRound('play', amount, match);
    },
    increaseCost: function(properties) {
        properties.amount = -properties.amount;
        return this.reduceCost(properties);
    }
};

module.exports = Effects;
