const _ = require('underscore');

const BaseStepWithPipeline = require('./basestepwithpipeline.js');
const SimpleStep = require('./simplestep.js');
const SelectChoice = require('./SelectChoice.js');

class AbilityResolver extends BaseStepWithPipeline {
    constructor(game, context) {
        super(game);

        this.context = context;
        this.pipeline.initialise([
            new SimpleStep(game, () => this.setNoNewActions()),
            new SimpleStep(game, () => this.createSnapshot()),
            new SimpleStep(game, () => this.resolveEarlyTargets()),
            new SimpleStep(game, () => this.waitForTargetResolution(true)),
            new SimpleStep(game, () => this.game.pushAbilityContext('card', context.source, 'cost')),
            new SimpleStep(game, () => this.resolveCosts()),
            new SimpleStep(game, () => this.waitForCostResolution()),
            new SimpleStep(game, () => this.markActionAsTaken()),
            new SimpleStep(game, () => this.payCosts()),
            new SimpleStep(game, () => this.game.popAbilityContext()),
            new SimpleStep(game, () => this.game.pushAbilityContext('card', context.source, 'effect')),
            new SimpleStep(game, () => this.resolveTargets()),
            new SimpleStep(game, () => this.waitForTargetResolution()),
            new SimpleStep(game, () => this.initiateAbility()),
            new SimpleStep(game, () => this.game.popAbilityContext())
        ]);
    }

    setNoNewActions() {
        _.each(this.game.getPlayers(), player => player.canInitiateAction = false);
    }

    createSnapshot() {
        if(['character', 'holding', 'attachment'].includes(this.context.source.getType())) {
            this.context.cardStateWhenInitiated = this.context.source.createSnapshot();
        }
    }

    markActionAsTaken() {
        if(this.context.ability.isAction() && !this.cancelled) {
            this.game.markActionAsTaken();
        }
    }

    resolveCosts() {
        if(this.cancelled) {
            return;
        }
        this.context.stage = 'costs';
        this.canPayResults = this.context.ability.resolveCosts(this.context);
    }

    waitForCostResolution() {
        if(this.cancelled) {
            return;
        }
        this.cancelled = _.any(this.canPayResults, result => result.resolved && !result.value);

        if(!_.all(this.canPayResults, result => result.resolved)) {
            return false;
        }
    }

    payCosts() {
        if(this.cancelled) {
            return;
        }
        if(this.context.ability.limit) {
            this.context.ability.limit.increment();
        }

        this.context.ability.payCosts(this.context);
    }

    resolveEarlyTargets() {
        if(this.cancelled) {
            return;
        }
        this.context.stage = 'target';
        if(this.context.ability.cannotTargetFirst) {
            this.targetResults = _.map(this.context.ability.targets, (props, name) => {
                return { resolved: false, name: name, value: null, costsFirst: true, mode: props.mode };
            });
        } else {
            this.targetResults = this.context.ability.resolveTargets(this.context);
        }
    }

    resolveTargets() {
        if(this.cancelled) {
            return;
        }
        this.context.stage = 'target';
        this.targetResults = this.context.ability.resolveTargets(this.context, this.targetResults);
    }

    waitForTargetResolution(pretarget = false) {
        if(this.cancelled) {
            return;
        }

        this.cancelled = _.any(this.targetResults, result => result.resolved && !result.value);

        if(!_.all(this.targetResults, result => result.resolved || (pretarget && result.costsFirst))) {
            return false;
        }

        _.each(this.targetResults, result => {
            if(result.mode === 'ring') {
                this.context.rings[result.name] = result.value;
                if(result.name === 'target') {
                    this.context.ring = result.value;
                }
            } else if(result.mode === 'select') {
                this.context.selects[result.name] = new SelectChoice(result.value);
                if(result.name === 'target') {
                    this.context.select = result.value;
                }
            } else {
                this.context.targets[result.name] = result.value;
                if(result.name === 'target') {
                    this.context.target = result.value;
                }
            }
        });
    }

    initiateAbility() {
        if(this.cancelled) {
            return;
        }
        if(this.context.ability.isCardAbility()) {
            this.game.raiseInitiateAbilityEvent({ card: this.context.source, context: this.context }, () => this.executeHandler());
        } else {
            this.executeHandler();
        }
    }

    executeHandler() {
        this.context.stage = 'effect';
        this.context.ability.executeHandler(this.context);
    }
}

module.exports = AbilityResolver;
