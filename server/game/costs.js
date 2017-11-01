const _ = require('underscore');
const ChooseCost = require('./costs/choosecost.js');
const CostBuilders = require('./costs/CostBuilders.js');

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
     * Cost that allows the player to choose between multiple costs. The
     * `choices` object should have string keys representing the button text
     * that will be used to prompt the player, with the values being the cost
     * associated with that choice.
     */
    choose: choices => new ChooseCost(choices),
    /**
     * Cost that will bow the card that initiated the ability.
     */
    bowSelf: () => CostBuilders.bow.self(),
    /**
     * Cost that requires bowing a card that matches the passed condition
     * predicate function.
     */
    bow: condition => CostBuilders.bow.select(condition),
    /**
     * Cost that requires bowing a certain number of cards that match the
     * passed condition predicate function.
     */
    bowMultiple: (amount, condition) => CostBuilders.bow.selectMultiple(amount, condition),
    /**
     * Cost that will sacrifice the card that initiated the ability.
     */
    sacrificeSelf: () => CostBuilders.sacrifice.self(),
    /**
     * Cost that requires sacrificing a card that matches the passed condition
     * predicate function.
     */
    sacrifice: condition => CostBuilders.sacrifice.select(condition),
    /**
     * Cost that will return a selected card to hand which matches the passed
     * condition.
     */
    returnToHand: condition => CostBuilders.returnToHand.select(condition),
    /**
     * Cost that will return to hand the card that initiated the ability.
     */
    returnSelfToHand: () => CostBuilders.returnToHand.self(),
    /**
     * Cost that requires discarding a card from hand.
     */
    discardFromHand: condition => CostBuilders.discardFromHand.select(condition),
    /**
     * Cost that will discard a fate from the card
     */
    discardFateFromSelf: () => CostBuilders.discardFate.self(),
    /**
     * Cost that will discard a fate from a selected card
     */
    discardFate: condition => CostBuilders.discardFate.select(condition),
    /**
     * Cost that will dishonor the character that initiated the ability.
     */
    dishonorSelf: () => CostBuilders.dishonor.self(),
    /**
     * Cost that requires dishonoring a card that matches the passed condition
     * predicate function.
     */
    dishonor: condition => CostBuilders.dishonor.select(condition),
    /**
     * Cost that will break the province that initiated the ability.
     */    
    breakSelf: () => CostBuilders.break.self(),
    /**
     * Cost that will pay the reduceable fate cost associated with an event card
     * and place it in discard.
     */
    playEvent: function() {
        return Costs.all(
            Costs.payReduceableFateCost('play'),
            Costs.expendEvent(),
            Costs.playLimited()
        );
    },
    /**
     * Cost which moves the event to the discard pile
     */
    expendEvent: function() {
        return {
            canPay: function(context) {
                return context.source.allowGameAction('play');
            },
            pay: function(context) {
                context.source.controller.moveCard(context.source, 'conflict discard pile');
            },
            canIgnoreForTargeting: true
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
            },
            canIgnoreForTargeting: true
        };
    },
    /**
     * Cost that ensures that the player has not exceeded the maximum usage for
     * an ability.
     */
    playMax: function() {
        return {
            canPay: function(context) {
                return !context.player.isAbilityAtMax(context.source.name);
            },
            pay: function(context) {
                context.player.incrementAbilityMax(context.source.name);
            },
            canIgnoreForTargeting: true
        };
    },
    /**
     * Cost that will pay the exact printed fate cost for the card.
     */
    payPrintedFateCost: function() {
        return {
            canPay: function(context) {
                let amount = context.source.getCost();
                return context.player.fate >= amount && (context.source.allowGameAction('spendFate') || amount === 0);
            },
            pay: function(context) {

                context.player.fate -= context.source.getCost();
            },
            canIgnoreForTargeting: true
        };
    },
    /**
     * Cost that will pay the printed fate cost on the card minus any active
     * reducer effects the play has activated. Upon playing the card, all
     * matching reducer effects will expire, if applicable.
     */
    payReduceableFateCost: function(playingType) {
        return {
            canPay: function(context, targets = []) {
                let reducedCost = context.player.getReducedCost(playingType, context.source);
                if(targets.length === 1) {
                    reducedCost = context.player.getReducedCost(playingType, context.source, targets[0]);
                } else if(context.target) {
                    reducedCost = context.player.getReducedCost(playingType, context.source, context.target);
                }
                return context.player.fate >= reducedCost && (context.source.allowGameAction('spendFate') || reducedCost === 0);
            },
            pay: function(context) {
                if(context.target) {
                    context.costs.fate = context.player.getReducedCost(playingType, context.source, context.target);
                    context.player.markUsedReducers(playingType, context.source, context.target);
                } else {
                    context.costs.fate = context.player.getReducedCost(playingType, context.source);
                    context.player.markUsedReducers(playingType, context.source);
                }
                context.player.fate -= context.costs.fate;
            },
            canIgnoreForTargeting: true
        };
    },
    /**
     * Cost in which the player must pay a fixed, non-reduceable amount of fate.
     */
    payFate: function(amount) {
        return {
            canPay: function(context) {
                return context.player.fate >= amount && (context.source.allowGameAction('spendFate') || amount === 0);
            },
            pay: function(context) {
                context.game.addFate(context.player, -amount);
            },
            canIgnoreForTargeting: true
        };
    },
    /**
     * Cost in which the player must pay a fixed, non-reduceable amount of honor.
     */
    payHonor: function(amount) {
        return {
            canPay: function(context) {
                return context.player.honor >= amount;
            },
            pay: function(context) {
                context.game.addHonor(context.player, -amount);
            }
        };
    },
    /**
     * Cost where a character must spend fate to an unclaimed ring
     */
    payFateToRing: function(amount) {
        return {
            canPay: function(context) {
                return context.player.fate >= amount && (context.source.allowGameAction('spendFate') || amount === 0);
            },
            resolve: function(context, result = { resolved: false }) {
                context.game.promptForRingSelect(context.player, {
                    ringCondition: ring => !ring.claimed && !ring.contested,
                    activePromptTitle: 'Choose a ring to place fate on',
                    source: context.source,
                    onSelect: (player, ring) => {
                        context.costs.payFateToRing = ring;
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
                context.game.addFate(context.player, -amount);
                context.costs.payFateToRing.modifyFate(amount);
            }
        };
    },
    giveFateToOpponent: function(amount) {
        return {
            canPay: function(context) {
                return context.player.fate >= amount && (context.source.allowGameAction('giveFate') || amount === 0);
            },
            pay: function(context) {
                context.game.addFate(context.player, -amount);
                let otherPlayer = context.game.getOtherPlayer(context.player);
                if(otherPlayer) {
                    context.game.addFate(otherPlayer, amount);
                }
            }
        };
    },
    chooseFate: function (maxfate = 3) {
        return {
            canPay: function() {
                return true;
            },
            resolve: function(context, result = { resolved: false }) {
                let extrafate = Math.min(context.player.fate - context.player.getReducedCost('play', context.source), maxfate);
                if(!context.source.allowGameAction('placeFate')) {
                    extrafate = 0;
                }
                let choices = [];
                for(let i = 0; i <= extrafate; i++) {
                    choices.push(i);
                }
                let handlers = _.map(choices, fate => {
                    return () => {
                        context.chooseFate = fate;
                        result.value = true;
                        result.resolved = true;
                    };
                });
                
                choices.push('Cancel');
                handlers.push(() => {
                    result.value = false;
                    result.resolved = true;
                });
                
                context.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Choose additional fate',
                    source: context.source,
                    choices: choices,
                    handlers: handlers
                });
                return result;
            },
            pay: function(context) {
                context.player.fate -= context.chooseFate;
            }
        };
    }
};

module.exports = Costs;
