const _ = require('underscore');

const AbilityLimit = require('./abilitylimit.js');
const CostReducer = require('./costreducer.js');
const PlayableLocation = require('./playablelocation.js');
const CannotRestriction = require('./cannotrestriction.js');
const ImmunityRestriction = require('./immunityrestriction.js');

function cannotEffect(type) {
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

const Effects = {
    all: function(effects) {
        let stateDependentEffects = _.filter(effects, effect => effect.isStateDependent);
        return {
            apply: function(card, context) {
                _.each(effects, effect => effect.apply(card, context));
            },
            reapply: function(card, context) {
                _.each(stateDependentEffects, effect => {
                    if(effect.reapply) {
                        effect.reapply(card, context);
                    } else {
                        effect.unapply(card, context);
                        effect.apply(card, context);
                    }
                });
            },
            unapply: function(card, context) {
                _.each(effects, effect => effect.unapply(card, context));
            },
            isStateDependent: (stateDependentEffects.length !== 0)
        };
    },
    cannotBeDeclaredAsAttacker: cannotEffect('declareAsAttacker'),
    cannotBeDeclaredAsDefender: cannotEffect('declareAsDefender'),
    cannotParticipate: cannotEffect('participateInConflict'),
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
            },
            unapply: function(card, context) {
                card.modifyMilitarySkill(-context.dynamicMilitarySkill[card.uuid], false);
                delete context.dynamicMilitarySkill[card.uuid];
            },
            isStateDependent: true
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
            },
            unapply: function(card, context) {
                card.modifyPoliticalSkill(-context.dynamicPoliticalSkill[card.uuid], false);
                delete context.dynamicPoliticalSkill[card.uuid];
            },
            isStateDependent: true
        };
    },
    discardByPoliticalSkill: {
        apply: function(card, context) {
            if(card.getPoliticalSkill() <= 0) {
                card.controller.discardCardFromPlay(card);
                context.game.addMessage('{0} is killed as its political is 0', card);
            }
        },
        unapply: function() {
            // nothing happens when this effect expires.
        },
        isStateDependent: true
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
    blank: {
        apply: function(card) {
            card.setBlank();
        },
        unapply: function(card) {
            card.clearBlank();
        }
    },
    discardIfStillInPlay: function() {
        return {
            apply: function(card, context) {
                context.discardIfStillInPlay = context.discardIfStillInPlay || [];
                context.discardIfStillInPlay.push(card);
            },
            unapply: function(card, context) {
                if(card.location === 'play area' && context.discardIfStillInPlay.includes(card)) {
                    context.discardIfStillInPlay = _.reject(context.discardIfStillInPlay, c => c === card);
                    card.controller.discardCard(card);
                    context.game.addMessage('{0} discards {1} at the end of the phase because of {2}', context.source.controller, card, context.source);
                }
            }
        };
    },
    returnToHandIfStillInPlay: function() {
        return {
            apply: function(card, context) {
                context.returnToHandIfStillInPlay = context.returnToHandIfStillInPlay || [];
                context.returnToHandIfStillInPlay.push(card);
            },
            unapply: function(card, context) {
                if(card.location === 'play area' && context.returnToHandIfStillInPlay.includes(card)) {
                    context.returnToHandIfStillInPlay = _.reject(context.returnToHandIfStillInPlay, c => c === card);
                    card.controller.returnCardToHand(card);
                    context.game.addMessage('{0} returns {1} to hand at the end of the phase because of {2}', context.source.controller, card, context.source);
                }
            }
        };
    },
    moveToBottomOfDeckIfStillInPlay: function() {
        return {
            apply: function(card, context) {
                context.moveToBottomOfDeckIfStillInPlay = context.moveToBottomOfDeckIfStillInPlay || [];
                context.moveToBottomOfDeckIfStillInPlay.push(card);
            },
            unapply: function(card, context) {
                if(card.location === 'play area' && context.moveToBottomOfDeckIfStillInPlay.includes(card)) {
                    context.moveToBottomOfDeckIfStillInPlay = _.reject(context.moveToBottomOfDeckIfStillInPlay, c => c === card);
                    card.owner.moveCardToBottomOfDeck(card);
                    context.game.addMessage('{0} moves {1} to the bottom of its owner\'s deck at the end of the phase because of {2}', context.source.controller, card, context.source);
                }
            }
        };
    },
    immuneTo: function(cardCondition) {
        let restriction = new ImmunityRestriction(cardCondition);
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
    cannotBeDiscarded: cannotEffect('discard'),
    cannotPlay: cannotEffect('play'),
    cannotTriggerCardAbilities: function() {
        return {
            apply: function(player) {
                player.cannotTriggerCardAbilities = true;
            },
            unapply: function(player) {
                player.cannotTriggerCardAbilities = false;
            }
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
