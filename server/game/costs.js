const _ = require('underscore');

const Costs = {
    /**
     * Cost that aggregates a list of other costs.
     */
    all: function(...costs) {
        return {
            canPay: function(context) {
                return _.all(costs, cost => cost.canPay(context));
            },
            pay: function(context) {
                _.each(costs, cost => cost.pay(context));
            }
        };
    },
    /**
     * Cost that will kneel the card that initiated the ability.
     */
    kneelSelf: function() {
        return {
            canPay: function(context) {
                return !context.source.kneeled;
            },
            pay: function(context) {
                context.source.controller.kneelCard(context.source);
            },
            canUnpay: function(context) {
                return context.source.kneeled;
            },
            unpay: function(context) {
                context.source.controller.standCard(context.source);
            }
        };
    },
    /**
     * Cost that will kneel the player's faction card.
     */
    kneelFactionCard: function() {
        return {
            canPay: function(context) {
                return !context.player.faction.kneeled;
            },
            pay: function(context) {
                context.player.kneelCard(context.player.faction);
            }
        };
    },
    /**
     * Cost that requires kneeling a card that matches the passed condition
     * predicate function.
     */
    kneel: function(condition) {
        var fullCondition = (card, context) => (
            !card.kneeled &&
            card.location === 'play area' &&
            card.controller === context.player &&
            condition(card)
        );
        return {
            canPay: function(context) {
                return context.player.anyCardsInPlay(card => fullCondition(card, context));
            },
            resolve: function(context) {
                var result = {
                    resolved: false
                };

                context.game.promptForSelect(context.player, {
                    cardCondition: card => fullCondition(card, context),
                    activePromptTitle: 'Select card to kneel',
                    source: context.source,
                    onSelect: (player, card) => {
                        context.kneelingCostCard = card;
                        result.value = true;
                        result.resolved = true;

                        return true;
                    },
                    onCancel: () => {
                        result.value = false;
                        result.resolved = true;
                    }
                });

                return result;
            },
            pay: function(context) {
                context.player.kneelCard(context.kneelingCostCard);
            }
        };
    },
    /**
     * Cost that requires kneeling a certain number of cards that match the
     * passed condition predicate function.
     */
    kneelMultiple: function(number, condition) {
        var fullCondition = (card, context) => (
            !card.kneeled &&
            card.location === 'play area' &&
            card.controller === context.player &&
            condition(card)
        );
        return {
            canPay: function(context) {
                return context.player.getNumberOfCardsInPlay(card => fullCondition(card, context)) >= number;
            },
            resolve: function(context) {
                var result = {
                    resolved: false
                };

                context.game.promptForSelect(context.player, {
                    cardCondition: card => fullCondition(card, context),
                    activePromptTitle: 'Select ' + number + ' cards to kneel',
                    numCards: number,
                    multiSelect: true,
                    source: context.source,
                    onSelect: (player, cards) => {
                        if(cards.length !== number) {
                            return false;
                        }

                        context.kneelingCostCards = cards;
                        result.value = true;
                        result.resolved = true;

                        return true;
                    },
                    onCancel: () => {
                        result.value = false;
                        result.resolved = true;
                    }
                });

                return result;
            },
            pay: function(context) {
                _.each(context.kneelingCostCards, card => {
                    context.player.kneelCard(card);
                });
            }
        };
    },
    /**
     * Cost that will sacrifice the card that initiated the ability.
     */
    sacrificeSelf: function() {
        return {
            canPay: function() {
                return true;
            },
            pay: function(context) {
                context.source.controller.sacrificeCard(context.source);
            }
        };
    },
    /**
     * Cost that will remove from game the card that initiated the ability.
     */
    removeSelfFromGame: function() {
        return {
            canPay: function() {
                return true;
            },
            pay: function(context) {
                context.source.controller.moveCard(context.source, 'out of game');
            }
        };
    },
    /**
     * Cost that requires you return a card matching the condition to the
     * player's hand.
     */
    returnToHand: function(condition) {
        var fullCondition = (card, context) => (
            card.location === 'play area' &&
            card.controller === context.player &&
            condition(card)
        );
        return {
            canPay: function(context) {
                return context.player.anyCardsInPlay(card => fullCondition(card, context));
            },
            resolve: function(context) {
                var result = {
                    resolved: false
                };

                context.game.promptForSelect(context.player, {
                    cardCondition: card => fullCondition(card, context),
                    activePromptTitle: 'Select card to return to hand',
                    source: context.source,
                    onSelect: (player, card) => {
                        context.costs.returnedToHandCard = card;
                        result.value = true;
                        result.resolved = true;

                        return true;
                    },
                    onCancel: () => {
                        result.value = false;
                        result.resolved = true;
                    }
                });

                return result;
            },
            pay: function(context) {
                context.player.returnCardToHand(context.costs.returnedToHandCard, false);
            }
        };
    },
    /**
     * Cost that will stand the card that initiated the ability (e.g.,
     * Barristan Selmy (TS)).
     */
    standSelf: function() {
        return {
            canPay: function(context) {
                return context.source.kneeled;
            },
            pay: function(context) {
                context.source.controller.standCard(context.source);
            }
        };
    },
    /**
     * Cost that will place the played event card in the player's discard pile.
     */
    expendEvent: function() {
        return {
            canPay: function(context) {
                return context.player.isCardInPlayableLocation(context.source, 'play') && context.source.canBePlayed();
            },
            pay: function(context) {
                context.source.controller.moveCard(context.source, 'discard pile');
            }
        };
    },
    /**
     * Cost that requires discarding a card from hand.
     */
    discardFromHand: function() {
        return {
            canPay: function(context) {
                return context.player.hand.size() >= 1;
            },
            resolve: function(context) {
                var result = {
                    resolved: false
                };

                context.game.promptForSelect(context.player, {
                    cardCondition: card => card.location === 'hand',
                    activePromptTitle: 'Select card to discard',
                    source: context.source,
                    onSelect: (player, card) => {
                        context.discardCostCard = card;
                        result.value = true;
                        result.resolved = true;

                        return true;
                    },
                    onCancel: () => {
                        result.value = false;
                        result.resolved = true;
                    }
                });

                return result;
            },
            pay: function(context) {
                context.player.discardCard(context.discardCostCard);
            }
        };
    },
    /**
     * Cost that will pay the reduceable gold cost associated with an event card
     * and place it in discard.
     */
    playEvent: function() {
        return Costs.all(
            Costs.payReduceableGoldCost('play'),
            Costs.expendEvent(),
            Costs.playLimited()
        );
    },
    /**
     * Cost that will discard a gold from the card. Used mainly by cards
     * having the bestow keyword.
     */
    discardGold: function() {
        return {
            canPay: function(context) {
                return context.source.hasToken('gold');
            },
            pay: function(context) {
                context.source.removeToken('gold', 1);
            }
        };
    },
    /**
     * Cost that will discard a fixed amount of power from the current card.
     */
    discardPowerFromSelf: function(amount = 1) {
        return {
            canPay: function(context) {
                return context.source.power >= amount;
            },
            pay: function(context) {
                context.source.modifyPower(-amount);
            }
        };
    },
    /**
     * Cost that will discard faction power matching the passed amount.
     */
    discardFactionPower: function(amount) {
        return {
            canPay: function(context) {
                return context.player.faction.power >= amount;
            },
            pay: function(context) {
                context.source.game.addPower(context.player, -amount);
            }
        };
    },
    /**
     * Cost that ensures that the player can still play a Limited card this
     * round.
     */
    playLimited: function() {
        return {
            canPay: function(context) {
                return !context.source.isLimited() || context.player.limitedPlayed < context.player.maxLimited;
            },
            pay: function(context) {
                if(context.source.isLimited()) {
                    context.player.limitedPlayed += 1;
                }
            }
        };
    },
    /**
     * Cost that will pay the exact printed gold cost for the card.
     */
    payPrintedGoldCost: function() {
        return {
            canPay: function(context) {
                var hasDupe = context.player.getDuplicateInPlay(context.source);
                if(hasDupe) {
                    return true;
                }

                return context.player.gold >= context.source.getCost();
            },
            pay: function(context) {
                var hasDupe = context.player.getDuplicateInPlay(context.source);
                if(hasDupe) {
                    return;
                }

                context.player.gold -= context.source.getCost();
            }
        };
    },
    /**
     * Cost that will pay the printed gold cost on the card minus any active
     * reducer effects the play has activated. Upon playing the card, all
     * matching reducer effects will expire, if applicable.
     */
    payReduceableGoldCost: function(playingType) {
        return {
            canPay: function(context) {
                var hasDupe = context.player.getDuplicateInPlay(context.source);
                if(hasDupe && playingType === 'marshal') {
                    return true;
                }

                return context.player.gold >= context.player.getReducedCost(playingType, context.source);
            },
            pay: function(context) {
                var hasDupe = context.player.getDuplicateInPlay(context.source);
                context.costs.isDupe = !!hasDupe;
                if(hasDupe && playingType === 'marshal') {
                    context.costs.gold = 0;
                } else {
                    context.costs.gold = context.player.getReducedCost(playingType, context.source);
                    context.player.gold -= context.costs.gold;
                    context.player.markUsedReducers(playingType, context.source);
                }
            }
        };
    },
    /**
     * Cost in which the player must pay a fixed, non-reduceable amount of gold.
     */
    payGold: function(amount) {
        return {
            canPay: function(context) {
                return context.player.gold >= amount;
            },
            pay: function(context) {
                context.game.addGold(context.player, -amount);
            }
        };
    }
};

module.exports = Costs;
