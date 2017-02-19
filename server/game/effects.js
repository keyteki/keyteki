const _ = require('underscore');

const Effects = {
    all: function(effects) {
        return {
            apply: function(card, context) {
                _.each(effects, effect => effect.apply(card, context));
            },
            unapply: function(card, context) {
                _.each(effects, effect => effect.unapply(card, context));
            },
            isStateDependent: _.any(effects, effect => !!effect.isStateDependent)
        };
    },
    allowAsAttacker: function(value) {
        return {
            apply: function(card, context) {
                context.allowAsAttacker = context.allowAsAttacker || {};
                context.allowAsAttacker[card.uuid] = card.challengeOptions.allowAsAttacker;
                card.challengeOptions.allowAsAttacker = value;
            },
            unapply: function(card, context) {
                card.challengeOptions.allowAsAttacker = context.allowAsAttacker[card.uuid];
                delete context.allowAsAttacker[card.uuid];
            }
        };
    },
    allowAsDefender: function(value) {
        return {
            apply: function(card, context) {
                context.allowAsDefender = context.allowAsDefender || {};
                context.allowAsDefender[card.uuid] = card.challengeOptions.allowAsDefender;
                card.challengeOptions.allowAsDefender = value;
            },
            unapply: function(card, context) {
                card.challengeOptions.allowAsDefender = context.allowAsDefender[card.uuid];
                delete context.allowAsDefender[card.uuid];
            }
        };
    },
    doesNotKneelAsAttacker: function() {
        return {
            apply: function(card) {
                card.challengeOptions.doesNotKneelAs.attacker = true;
            },
            unapply: function(card) {
                card.challengeOptions.doesNotKneelAs.attacker = false;
            }
        };
    },
    doesNotKneelAsDefender: function() {
        return {
            apply: function(card) {
                card.challengeOptions.doesNotKneelAs.defender = true;
            },
            unapply: function(card) {
                card.challengeOptions.doesNotKneelAs.defender = false;
            }
        };
    },
    canBeDeclaredWithoutIcon: function() {
        return {
            apply: function(card) {
                card.challengeOptions.canBeDeclaredWithoutIcon = true;
            },
            unapply: function(card) {
                card.challengeOptions.canBeDeclaredWithoutIcon = false;
            }
        };
    },
    canBeDeclaredWhileKneeling: function() {
        return {
            apply: function(card) {
                card.challengeOptions.canBeDeclaredWhileKneeling = true;
            },
            unapply: function(card) {
                card.challengeOptions.canBeDeclaredWhileKneeling = false;
            }
        };
    },
    modifyStrength: function(value) {
        return {
            apply: function(card) {
                card.strengthModifier += value;
            },
            unapply: function(card) {
                card.strengthModifier -= value;
            }
        };
    },
    modifyGold: function(value) {
        return {
            apply: function(card) {
                card.goldModifier += value;
            },
            unapply: function(card) {
                card.goldModifier -= value;
            }
        };
    },
    modifyInitiative: function(value) {
        return {
            apply: function(card) {
                card.initiativeModifier += value;
            },
            unapply: function(card) {
                card.initiativeModifier -= value;
            }
        };
    },
    modifyReserve: function(value) {
        return {
            apply: function(card) {
                card.reserveModifier += value;
            },
            unapply: function(card) {
                card.reserveModifier -= value;
            }
        };
    },
    modifyClaim: function(value) {
        return {
            apply: function(card) {
                card.claimModifier += value;
            },
            unapply: function(card) {
                card.claimModifier -= value;
            }
        };
    },
    preventPlotModifier: function(modifier) {
        return {
            apply: function(card) {
                card.canProvidePlotModifier[modifier] = false;
            },
            unapply: function(card) {
                card.canProvidePlotModifier[modifier] = true;
            }
        };
    },
    dynamicStrength: function(calculate) {
        return {
            apply: function(card, context) {
                context.dynamicStrength = context.dynamicStrength || {};
                context.dynamicStrength[card.uuid] = calculate(card, context);
                card.strengthModifier += context.dynamicStrength[card.uuid];
            },
            unapply: function(card, context) {
                card.strengthModifier -= context.dynamicStrength[card.uuid];
                delete context.dynamicStrength[card.uuid];
            },
            isStateDependent: true
        };
    },
    addIcon: function(icon) {
        return {
            apply: function(card) {
                card.addIcon(icon);
            },
            unapply: function(card) {
                card.removeIcon(icon);
            }
        };
    },
    removeIcon: function(icon) {
        return {
            apply: function(card) {
                card.removeIcon(icon);
            },
            unapply: function(card) {
                card.addIcon(icon);
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
    killByStrength: {
        apply: function(card, context) {
            if(card.getStrength() <= 0) {
                card.controller.killCharacter(card, false);
                context.game.addMessage('{0} is killed as its STR is 0', card);
            }
        },
        unapply: function() {
            // nothing happens when this effect expires.
        },
        isStateDependent: true
    },
    blank: {
        apply: function(card) {
            card.setBlank();
        },
        unapply: function(card) {
            card.clearBlank();
        }
    },
    poison: {
        apply: function(card, context) {
            card.addToken('poison', 1);
            context.game.addMessage('{0} uses {1} to place 1 poison token on {2}', context.source.controller, context.source, card);
        },
        unapply: function(card, context) {
            if(card.location === 'play area' && card.hasToken('poison')) {
                card.removeToken('poison', 1);
                card.controller.killCharacter(card);
                context.game.addMessage('{0} uses {1} to kill {2} at the end of the phase', context.source.controller, context.source, card);
            }
        }
    },
    gainAmbush: function(costModifier = 0) {
        return {
            apply: function(card, context) {
                context.gainAmbush = context.gainAmbush || {};
                context.gainAmbush[card.uuid] = card.ambushCost;
                card.ambushCost = card.cardData.cost + costModifier;
            },
            unapply: function(card, context) {
                card.ambushCost = context.gainAmbush[card.uuid];
                delete context.gainAmbush[card.uuid];
            }
        };
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
                    card.controller.discardCard(card, allowSave);
                    context.game.addMessage('{0} discards {1} at the end of the phase because of {2}', context.source.controller, card, context.source);
                }
            }
        };
    },
    killIfStillInPlay: function(allowSave = false) {
        return {
            apply: function(card, context) {
                context.killIfStillInPlay = context.killIfStillInPlay || [];
                context.killIfStillInPlay.push(card);
            },
            unapply: function(card, context) {
                if(card.location === 'play area' && context.killIfStillInPlay.includes(card)) {
                    context.killIfStillInPlay = _.reject(context.killIfStillInPlay, c => c === card);
                    card.controller.killCharacter(card, allowSave);
                    context.game.addMessage('{0} kills {1} at the end of the phase because of {2}', context.source.controller, card, context.source);
                }
            }
        };
    },
    moveToDeadPileIfStillInPlay: function() {
        return {
            apply: function(card, context) {
                context.moveToDeadPileIfStillInPlay = context.moveToDeadPileIfStillInPlay || [];
                context.moveToDeadPileIfStillInPlay.push(card);
            },
            unapply: function(card, context) {
                if(card.location === 'play area' && context.moveToDeadPileIfStillInPlay.includes(card)) {
                    context.moveToDeadPileIfStillInPlay = _.reject(context.moveToDeadPileIfStillInPlay, c => c === card);
                    card.owner.moveCard(card, 'dead pile');
                    context.game.addMessage('{0} moves {1} to its owner\'s dead pile at the end of the phase because of {2}', context.source.controller, card, context.source);
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
    cannotMarshal: function() {
        return {
            apply: function(card) {
                card.cannotMarshal = true;
            },
            unapply: function(card) {
                card.cannotMarshal = false;
            }
        };
    },
    cannotPlay: function() {
        return {
            apply: function(card) {
                card.cannotPlay = true;
            },
            unapply: function(card) {
                card.cannotPlay = false;
            }
        };
    },
    modifyChallengeTypeLimit: function(challengeType, value) {
        return {
            apply: function(player) {
                player.addChallenge(challengeType, value);
            },
            unapply: function(player) {
                player.addChallenge(challengeType, -value);
            }
        };
    },
    setMaxChallenge: function(max) {
        return {
            apply: function(player) {
                player.setMaxChallenge(max);
            },
            unapply: function(player) {
                player.clearMaxChallenge();
            }
        };
    },
    setMinReserve: function(min) {
        return {
            apply: function(player, context) {
                context.setMinReserve = context.setMinReserve || {};
                context.setMinReserve[player.id] = player.minReserve;
                player.minReserve = min;
            },
            unapply: function(player, context) {
                player.minReserve = context.setMinReserve[player.id];
                delete context.setMinReserve[player.id];
            }
        };
    },
    setChallengerLimit: function(value) {
        return {
            apply: function(player, context) {
                context.setChallengerLimit = context.setChallengerLimit || {};
                context.setChallengerLimit[player.id] = player.challengerLimit;
                player.challengerLimit = value;
            },
            unapply: function(player, context) {
                player.challengerLimit = context.setChallengerLimit[player.id];
                delete context.setChallengerLimit[player.id];
            }
        };
    },
    cannotWinChallenge: function() {
        return {
            apply: function(player) {
                player.cannotWinChallenge = true;
            },
            unapply: function(player) {
                player.cannotWinChallenge = false;
            }
        };
    },
    /**
     * Effects specifically for Old Wyk.
     */
    returnToHandOrDeckBottom: function() {
        return {
            apply: function(card, context) {
                context.returnToHandOrDeckBottom = context.returnToHandOrDeckBottom || [];
                context.returnToHandOrDeckBottom.push(card);
            },
            unapply: function(card, context) {
                if(!context.returnToHandOrDeckBottom.includes(card)) {
                    return;
                }

                context.returnToHandOrDeckBottom = _.reject(context.returnToHandOrDeckBottom, c => c === card);

                var challenge = context.game.currentChallenge;
                if(challenge && challenge.winner === context.source.controller && challenge.strengthDifference >= 5) {
                    card.controller.moveCard(card, 'hand');
                    context.game.addMessage('{0} returns {1} to their hand', context.source.controller, card);
                } else {
                    card.controller.moveCard(card, 'draw deck', { bottom: true });
                    context.game.addMessage('{0} returns {1} to the bottom of their deck', context.source.controller, card);
                }
            }
        };
    }
};

module.exports = Effects;
