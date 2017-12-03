const _ = require('underscore');

const BaseStepWithPipeline = require('./basestepwithpipeline.js');
const SimpleStep = require('./simplestep.js');

class AbilityResolver extends BaseStepWithPipeline {
    constructor(game, context) {
        super(game);

        this.context = context;
        this.pipeline.initialise([
            new SimpleStep(game, () => this.setNoNewActions()),
            new SimpleStep(game, () => this.createSnapshot()),
            new SimpleStep(game, () => this.resolveEarlyTargets()),
            new SimpleStep(game, () => this.waitForTargetResolution(true)),
            new SimpleStep(game, () => this.resolveCosts()),
            new SimpleStep(game, () => this.waitForCostResolution()),
            new SimpleStep(game, () => this.payCosts()),
            new SimpleStep(game, () => this.checkCostsHaveBeenPaid()),
            new SimpleStep(game, () => this.resolveTargets()),
            new SimpleStep(game, () => this.waitForTargetResolution()),
            new SimpleStep(game, () => this.initiateAbility())
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
        this.costEvents = this.context.ability.payCosts(this.context);
    }

    checkCostsHaveBeenPaid() {
        if(this.cancelled) {
            return;
        }
        this.cancelled = _.any(this.costEvents, event => event.result.resolved && !event.result.success);

        if(this.cancelled) {
            this.game.addMessage('{0} attempted to use {1}, but did not successfully pay the required costs', this.context.player, this.context.source);
        }

        if(!_.all(this.costEvents, event => event.result.resolved)) {
            return false;
        }
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
        if(this.cancelled && !pretarget) {
            this.game.addMessage('{0} attempted to use {1}, but targets were not chosen', this.context.player, this.context.source);
        }

        if(!_.all(this.targetResults, result => result.resolved || (pretarget && result.costsFirst))) {
            return false;
        }

        _.each(this.targetResults, result => {
            if(result.name === 'target') {
                if(result.mode === 'ring') {
                    this.context.ring = result.value;
                } else if(result.mode === 'select') {
                    this.context.select = result.value;
                } else {
                    this.context.target = result.value;
                }
            }
        });
    }

    initiateAbility() {
        if(this.cancelled) {
            return;
        }
        // Increment limits (limits aren't used up on cards in hand)
        if(this.context.ability.limit && this.context.source.location !== 'hand') {
            this.context.ability.limit.increment();
        }
        if(this.context.ability.max) {
            this.context.player.incrementAbilityMax(this.context.ability.maxIdentifier);
        }

        // If this is a card ability, raise an initiateAbilityEvent
        if(this.context.ability.isCardAbility()) {
            this.game.raiseInitiateAbilityEvent({ card: this.context.source, context: this.context }, () => this.executeHandler());
        } else {
            this.executeHandler();
        }

        // If this is an event, move it to 'being played', and queue a step to send it to the discard pile after it resolves
        if(this.context.source.type === 'event') {
            this.context.player.moveCard(this.context.source, 'being played');
            this.game.queueSimpleStep(() => this.context.player.moveCard(this.context.source, 'conflict discard pile'));
        }

    }

    executeHandler() {
        this.context.stage = 'effect';
        this.context.ability.executeHandler(this.context);
    }
}

module.exports = AbilityResolver;
