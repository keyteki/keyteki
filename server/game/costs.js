const _ = require('underscore');
const ChooseCost = require('./costs/choosecost.js');

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
    choose: function(choices) {
        return new ChooseCost(choices);
    },
    /**
     * Cost that will bow the card that initiated the ability.
     */
    bowSelf: function() {
        return {
            canPay: function(context) {
                return !context.source.bowed;
            },
            pay: function(context) {
                context.source.controller.bowCard(context.source);
            },
            canUnpay: function(context) {
                return context.source.bowed;
            },
            unpay: function(context) {
                context.source.controller.standCard(context.source);
            }
        };
    },
    /**
     * Cost that will bow the player's faction card.
     */
    bowFactionCard: function() {
        return {
            canPay: function(context) {
                return !context.player.faction.bowed;
            },
            pay: function(context) {
                context.player.bowCard(context.player.faction);
            }
        };
    },
    /**
     * Cost that requires bowing a card that matches the passed condition
     * predicate function.
     */
    bow: function(condition) {
        var fullCondition = (card, context) => (
            !card.bowed &&
            card.location === 'play area' &&
            card.controller === context.player &&
            condition(card)
        );
        return {
            canPay: function(context) {
                return context.player.anyCardsInPlay(card => fullCondition(card, context));
            },
            resolve: function(context, result = { resolved: false }) {
                context.game.promptForSelect(context.player, {
                    cardCondition: card => fullCondition(card, context),
                    activePromptTitle: 'Select card to bow',
                    source: context.source,
                    onSelect: (player, card) => {
                        context.bowingCostCard = card;
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
                context.player.bowCard(context.bowingCostCard);
            }
        };
    },
    /**
     * Cost that requires bowing a certain number of cards that match the
     * passed condition predicate function.
     */
    bowMultiple: function(number, condition) {
        var fullCondition = (card, context) => (
            !card.bowed &&
            card.location === 'play area' &&
            card.controller === context.player &&
            condition(card)
        );
        return {
            canPay: function(context) {
                return context.player.getNumberOfCardsInPlay(card => fullCondition(card, context)) >= number;
            },
            resolve: function(context, result = { resolved: false }) {
                context.game.promptForSelect(context.player, {
                    cardCondition: card => fullCondition(card, context),
                    activePromptTitle: 'Select ' + number + ' cards to bow',
                    numCards: number,
                    mode: 'exactly',
                    source: context.source,
                    onSelect: (player, cards) => {
                        context.bowingCostCards = cards;
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
                _.each(context.bowingCostCards, card => {
                    context.player.bowCard(card);
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
     * Cost that requires sacrificing a card that matches the passed condition
     * predicate function.
     */
    sacrifice: function(condition) {
        var fullCondition = (card, context) => (
            card.location === 'play area' &&
            card.controller === context.player &&
            condition(card)
        );
        return {
            canPay: function(context) {
                return context.player.anyCardsInPlay(card => fullCondition(card, context));
            },
            resolve: function(context, result = { resolved: false }) {
                context.game.promptForSelect(context.player, {
                    cardCondition: card => fullCondition(card, context),
                    activePromptTitle: 'Select card to sacrifice',
                    source: context.source,
                    onSelect: (player, card) => {
                        context.sacrificeCostCard = card;
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
                context.player.sacrificeCard(context.sacrificeCostCard);
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
            resolve: function(context, result = { resolved: false }) {
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
     * Cost that will return to hand the card that initiated the ability.
     */
    returnSelfToHand: function() {
        return {
            canPay: function() {
                return true;
            },
            pay: function(context) {
                context.source.controller.returnCardToHand(context.source, false);
            }
        };
    },
    /**
     * Cost that requires revealing a certain number of cards in hand that match
     * the passed condition predicate function.
     */
    revealCards: function(number, condition) {
        var fullCondition = (card, context) => (
            card.location === 'hand' &&
            card.controller === context.player &&
            condition(card)
        );
        return {
            canPay: function(context) {
                let potentialCards = context.player.findCards(context.player.hand, card => fullCondition(card, context));
                return _.size(potentialCards) >= number;
            },
            resolve: function(context, result = { resolved: false }) {
                context.game.promptForSelect(context.player, {
                    cardCondition: card => fullCondition(card, context),
                    activePromptTitle: 'Select ' + number + ' cards to reveal',
                    numCards: number,
                    mode: 'exactly',
                    source: context.source,
                    onSelect: (player, cards) => {
                        context.revealingCostCards = cards;
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
                context.game.addMessage('{0} reveals {1} from their hand', context.player, context.revealingCostCards);
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
                return context.source.bowed;
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
                context.source.controller.moveCard(context.source, 'conflict discard pile');
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
            resolve: function(context, result = { resolved: false }) {
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
                context.player.discardCardFromHand(context.discardCostCard);
            }
        };
    },
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
     * Cost that will discard a fate from the card
     */
    discardFate: function(amount) {
        return {
            canPay: function(context) {
                return context.source.fate >= amount;
            },
            pay: function(context) {
                context.source.modifyFate(-amount);
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
     * Cost that will pay the exact printed fate cost for the card.
     */
    payPrintedFateCost: function() {
        return {
            canPay: function(context) {

                return context.player.fate >= context.source.getCost();
            },
            pay: function(context) {

                context.player.fate -= context.source.getCost();
            }
        };
    },
    /**
     * Cost that will pay the printed fate cost on the card minus any active
     * reducer effects the play has activated. Upon playing the card, all
     * matching reducer effects will expire, if applicable.
     */
    payReduceableFateCost: function(playingType) {
        return {
            canPay: function(context) {

                return context.player.fate >= context.player.getReducedCost(playingType, context.source);
            },
            pay: function(context) {

                context.costs.fate = context.player.getReducedCost(playingType, context.source);
                context.player.fate -= context.costs.fate;
                context.player.markUsedReducers(playingType, context.source);

            }
        };
    },
    /**
     * Cost in which the player must pay a fixed, non-reduceable amount of fate.
     */
    payFate: function(amount) {
        return {
            canPay: function(context) {
                return context.player.fate >= amount;
            },
            pay: function(context) {
                context.game.addFate(context.player, -amount);
            }
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
     * Player must dishonor a character (possible with some condition
     */
    dishonorCharacter: function(condition) {
        var fullCondition = (card, context) => (
            card.location === 'play area' &&
            card.controller === context.player &&
            card.allowGameAction('dishonor') &&
            condition(card)
        );
        return {
            canPay: function(context) {
                return context.player.anyCardsInPlay(card => fullCondition(card, context));
            },
            resolve: function(context, result = { resolved: false }) {
                context.game.promptForSelect(context.player, {
                    cardCondition: card => fullCondition(card, context),
                    activePromptTitle: 'Choose a character to dishonor',
                    source: context.source,
                    onSelect: (player, card) => {
                        context.costs.dishonorCharacter = card;
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
                context.player.dishonorCard(context.costs.dishonorCharacter);
            }
        };
    },
    /**
     * Cost where a character must spend fate to an unclaimed ring
     */
    payFateToRing: function(amount) {
        return {
            canPay: function(context) {
                return context.player.fate >= amount;
            },
            resolve: function(context, result = { resolved: false }) {
                context.game.promptForRingSelect(context.player, {
                    condition: ring => !ring.claimed && !ring.contested,
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
                return context.player.fate >= amount;
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
    breakProvince: function(province) {
        return {
            canPay: function() {
                return !province.isBroken;
            },
            pay: function(context) {
                context.costs.breakProvince = province;
                this.game.raiseEvent('onBreakProvince', { conflict: this.conflict, province: province }, province.breakProvince());
            }
        };
    }
};

module.exports = Costs;
