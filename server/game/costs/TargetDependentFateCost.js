const ReduceableFateCost = require('./ReduceableFateCost');

class TargetDependentFateCost extends ReduceableFateCost {
    constructor(playingType, targetName) {
        super(playingType);
        this.dependsOn = targetName;
    }

    canPay(context) {
        if(!context.targets[this.dependsOn]) {
            // we don't need to check now because this will be checked again once targeting is done
            return true;
        }
        let reducedCost = context.player.getMinimumCost(this.playingType, context.source, context.targets[this.dependsOn]);
        return context.player.fate >= reducedCost && (reducedCost === 0 || context.player.checkRestrictions('spendFate', context));
    }

    getReducedCost(context) {
        return context.player.getReducedCost(this.playingType, context.source, context.targets[this.dependsOn]);
    }

    pay(context) {
        context.costs.targetDependentFate = this.getReducedCost(context);
        context.player.markUsedReducers(this.playingType, context.source, context.targets[this.dependsOn]);
        context.player.fate -= this.getFinalFatecost(context, context.costs.targetDependentFate);
    }


}

module.exports = TargetDependentFateCost;
