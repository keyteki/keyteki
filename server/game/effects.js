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
                context.dynamicStrength[card] = calculate(card, context);
                card.strengthModifier += context.dynamicStrength[card];
            },
            unapply: function(card, context) {
                card.strengthModifier -= context.dynamicStrength[card];
                delete context.dynamicStrength[card];
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
    takeControl: function(newController) {
        return {
            apply: function(card, context) {
                context.takeControl = context.takeControl || {};
                context.takeControl[card] = { originalController: card.controller };
                context.game.takeControl(newController, card);
                context.game.addMessage('{0} uses {1} to take control of {2}', context.source.controller, context.source, card);
            },
            unapply: function(card, context) {
                context.game.takeControl(context.takeControl[card].originalController, card);
                delete context.takeControl[card];
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
                context.setMinReserve[player] = player.minReserve;
                player.minReserve = min;
            },
            unapply: function(player, context) {
                player.minReserve = context.setMinReserve[player];
            }
        };
    }
};

module.exports = Effects;
