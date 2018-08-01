const ForcedTriggeredAbilityWindow = require('../gamesteps/forcedtriggeredabilitywindow.js');

class FateCostInterruptWindow extends ForcedTriggeredAbilityWindow {
    constructor(context, minCostReduction, result) {
        super(context.game);
        this.abilityType = 'interrupt';
        this.currentPlayer = context.player;
        this.card = context.source;
        this.result = result;
        this.minCostReduction = minCostReduction;
        this.totalReduction = 0;
        this.complete = false;
        this.eventWindow = true;
    }

    filterChoices() {
        if(this.complete || this.choices.length === 0) {
            return true;
        }
        this.promptBetweenSources(this.choices);
        return false;
    }

    getPromptForSelectProperties() {
        let buttons = [];
        if(this.resolvedAbilities.length === 0 && this.result.canCancel) {
            buttons.push({ text: 'Cancel', arg: 'cancel' });
        }
        if(this.totalReduction >= this.minCostReduction) {
            buttons.push({ text: 'Pass', arg: 'pass' });
        }
        return Object.assign(super.getPromptForSelectProperties(), {
            selectCard: this.currentPlayer.optionSettings.markCardsUnselectable,
            buttons: buttons,
            onCancel: () => this.result.cancelled = true,
            onMenuCommand: () => {
                this.complete = true;
                return true;
            }
        });
    }

    resolveAbility(context) {
        this.totalReduction += 1;
        this.result.canCancel = false;
        super.resolveAbility(context);
    }

    emitEvents() {
        this.choices = [];
        let event = this.game.getEvent('onResolveFateCost', { card: this.card, player: this.currentPlayer });
        this.game.emit('onResolveFateCost:interrupt', event, this);
    }
}

class ReduceableFateCost {
    constructor(playingType) {
        this.playingType = playingType;
    }

    canPay(context) {
        let minCost = context.player.getMinimumCost(this.playingType, context.source);
        return context.player.fate >= minCost && (minCost === 0 || context.player.checkRestrictions('spendFate', context));
    }

    resolve(context, result) {
        //console.log('resolveCost');
        let alternatePools = context.player.getAlternateFatePools(this.playingType, context.source);
        let alternatePoolTotal = alternatePools.reduce((total, pool) => total + pool.fate, 0);
        let maxPlayerFate = context.player.checkRestrictions('spendFate', context) ? context.player.fate : 0;
        let minCostReduction = Math.max(this.getReducedCost(context) - maxPlayerFate - alternatePoolTotal, 0);
        context.game.queueStep(new FateCostInterruptWindow(context, minCostReduction, result));
        context.game.queueSimpleStep(() => {
            alternatePoolTotal = alternatePools.reduce((total, pool) => total + pool.fate, 0);
            if(this.getReducedCost(context) > maxPlayerFate + alternatePoolTotal) {
                result.cancelled = true;
            } else if(!result.cancelled && alternatePools.length > 0 && context.player.checkRestrictions('takeFateFromRings', context)) {
                let properties = {
                    reducedCost: this.getReducedCost(context),
                    remainingPoolTotal: alternatePoolTotal
                };
                context.costs.alternateFate = new Map();
                let maxPlayerFate = context.player.checkRestrictions('spendFate', context) ? context.player.fate : 0;
                for(const alternatePool of alternatePools) {
                    context.game.queueSimpleStep(() => {
                        properties.remainingPoolTotal -= alternatePool.fate;
                        properties.minFate = Math.max(properties.reducedCost - maxPlayerFate - properties.remainingPoolTotal, 0);
                        properties.maxFate = Math.min(alternatePool.fate, properties.reducedCost);
                        properties.pool = alternatePool;
                        properties.numberOfChoices = properties.maxFate - properties.minFate + 1;
                        if(result.cancelled || properties.numberOfChoices === 0) {
                            return;
                        }
                        this.promptForAlternateFate(context, result, properties);
                    });
                }
            }
        });
    }

    getReducedCost(context) {
        return context.player.getReducedCost(this.playingType, context.source);
    }

    promptForAlternateFate(context, result, properties) {
        let choices = Array.from(Array(properties.numberOfChoices), (x, i) => i + properties.minFate);
        if(result.canCancel) {
            choices.push('Cancel');
        }
        context.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: 'Choose amount of fate to spend from the ' + properties.pool.name,
            choices: choices,
            choiceHandler: choice => {
                if(choice === 'Cancel') {
                    result.cancelled = true;
                    return;
                }
                if(choice > 0) {
                    context.game.addMessage('{0} takes {1} fate from {2} to pay the cost of {3}', context.player, choice, properties.pool, context.source);
                }
                context.costs.alternateFate.set(properties.pool, choice);
                properties.reducedCost -= choice;
            }
        });
    }

    pay(context) {
        context.costs.fate = this.getReducedCost(context);
        context.player.markUsedReducers(this.playingType, context.source);
        context.player.fate -= this.getFinalFatecost(context, context.costs.fate);
    }

    getFinalFatecost(context, reducedCost) {
        if(!context.costs.alternateFate) {
            return reducedCost;
        }
        let totalAlternateFate = 0;
        for(let alternatePool of context.player.getAlternateFatePools(this.playingType, context.source)) {
            alternatePool.modifyFate(-context.costs.alternateFate.get(alternatePool));
            totalAlternateFate += context.costs.alternateFate.get(alternatePool);
        }
        return Math.max(reducedCost - totalAlternateFate, 0);
    }
}

module.exports = ReduceableFateCost;
