const BaseStepWithPipeline = require('./basestepwithpipeline.js');
const SimpleStep = require('./simplestep.js');

class AbilityResolver extends BaseStepWithPipeline {
    constructor(game, context) {
        super(game);

        this.context = context;
        this.canCancel = true;
        this.targetResults = {};
        this.initialise();
    }

    initialise() {
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.createSnapshot()),
            new SimpleStep(this.game, () => this.payCostsThatCanFail()),
            new SimpleStep(this.game, () => this.payCosts()),
            new SimpleStep(this.game, () => this.resolveTargets()),
            new SimpleStep(this.game, () => this.initiateAbility()),
            new SimpleStep(this.game, () => this.executeHandler()),
            new SimpleStep(this.game, () => this.raiseResolvedEvent())
        ]);
    }

    createSnapshot() {
        if (['creature', 'artifact'].includes(this.context.source.getType())) {
            this.context.cardStateWhenInitiated = this.context.source.createSnapshot();
        }
    }

    resolveEarlyTargets() {
        if (this.cancelled) {
            return;
        }

        this.targetResults = this.context.ability.resolveTargets(this.context);
    }

    checkForCancel() {
        if (this.cancelled) {
            return;
        }

        this.cancelled = this.targetResults.cancelled;
    }

    payCostsThatCanFail() {
        if (this.cancelled) {
            return;
        }

        this.costEventsThatCanFail = this.context.ability.payCostsThatCanFail(this.context);
        if (this.costEventsThatCanFail.length > 0) {
            this.game.openEventWindow(this.costEventsThatCanFail);
        }
    }

    payCosts() {
        if (this.cancelled) {
            return;
        }

        if (this.costEventsThatCanFail) {
            for (let e of this.costEventsThatCanFail) {
                if (e.cancelled) {
                    this.cancelled = true;
                    return;
                }
            }
        }

        this.costEvents = this.context.ability.payCosts(this.context);
        if (this.costEvents.length > 0) {
            this.game.openEventWindow(this.costEvents);
        }
    }

    resolveTargets() {
        if (this.cancelled) {
            return;
        }

        this.targetResults = this.context.ability.resolveTargets(this.context);
    }

    initiateAbility() {
        if (this.cancelled) {
            return;
        } else if (this.targetResults.cancelled) {
            this.cancelled = true;
            return;
        }

        this.game.raiseEvent('onAbilityInitiated', {
            context: this.context,
            noGameStateCheck: true
        });
    }

    executeHandler() {
        if (this.cancelled) {
            return;
        }

        this.context.stage = 'effect';
        this.context.ability.displayMessage(this.context);
        this.context.ability.executeHandler(this.context);
    }

    raiseResolvedEvent() {
        if (this.cancelled) {
            return;
        }

        this.game.raiseEvent('onAbilityResolved', { context: this.context });
    }
}

module.exports = AbilityResolver;
