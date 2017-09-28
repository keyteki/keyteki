const _ = require('underscore');

const AbilityLimit = require('./abilitylimit.js');
const CostReducer = require('./costreducer.js');
const PlayableLocation = require('./playablelocation.js');
const CannotRestriction = require('./cannotrestriction.js');

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
    cannotParticipate: cannotEffect('participateInChallenge'),
    modifyStrength: function(value) {
        return {
            apply: function(card) {
                card.modifyStrength(value, true);
            },
            unapply: function(card) {
                card.modifyStrength(-value, false);
            }
        };
    },
    dynamicStrength: function(calculate) {
        return {
            apply: function(card, context) {
                context.dynamicStrength = context.dynamicStrength || {};
                context.dynamicStrength[card.uuid] = calculate(card, context) || 0;
                card.modifyStrength(context.dynamicStrength[card.uuid], true);
            },
            reapply: function(card, context) {
                let currentStrength = context.dynamicStrength[card.uuid];
                let newStrength = calculate(card, context) || 0;
                context.dynamicStrength[card.uuid] = newStrength;
                card.modifyStrength(newStrength - currentStrength, true);
            },
            unapply: function(card, context) {
                card.modifyStrength(-context.dynamicStrength[card.uuid], false);
                delete context.dynamicStrength[card.uuid];
            },
            isStateDependent: true
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
    blank: {
        apply: function(card) {
            card.setBlank();
        },
        unapply: function(card) {
            card.clearBlank();
        }
    },
    discardIfStillInPlay: function(allowSave = false) {
        return {
            apply: function(card, context) {
                context.discardIfStillInPlay = context.discardIfStillInPlay || [];
                context.discardIfStillInPlay.push(card);
            },
            unapply: function(card, context) {
                if(card.location === 'play area' && context.discardIfStillInPlay.includes(card)) {
                    context.discardIfStillInPlay = _.reject(context.discardIfStillInPlay, c => c === card);
                    card.controller.discardCardFromPlay(card, allowSave);
                    context.game.addMessage('{0} discards {1} at the end of the phase because of {2}', context.source.controller, card, context.source);
                }
            }
        };
    },
    returnToHandIfStillInPlay: function(allowSave = false) {
        return {
            apply: function(card, context) {
                context.returnToHandIfStillInPlay = context.returnToHandIfStillInPlay || [];
                context.returnToHandIfStillInPlay.push(card);
            },
            unapply: function(card, context) {
                if(card.location === 'play area' && context.returnToHandIfStillInPlay.includes(card)) {
                    context.returnToHandIfStillInPlay = _.reject(context.returnToHandIfStillInPlay, c => c === card);
                    card.controller.returnCardToHand(card, allowSave);
                    context.game.addMessage('{0} returns {1} to hand at the end of the phase because of {2}', context.source.controller, card, context.source);
                }
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
