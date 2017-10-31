const _ = require('underscore');

const BaseCard = require('../basecard.js');
const BaseStepWithPipeline = require('./basestepwithpipeline.js');
const SimpleStep = require('./simplestep.js');

class AbilityResolver extends BaseStepWithPipeline {
    constructor(game, ability, context) {
        super(game);

        this.ability = ability;
        this.context = context;
        this.context.ability = ability;
        this.pipeline.initialise([
            new SimpleStep(game, () => this.setNoNewActions()),
            new SimpleStep(game, () => this.resolveEarlyTargets()),
            new SimpleStep(game, () => this.waitForTargetResolution(true)),
            new SimpleStep(game, () => this.game.pushAbilityContext('card', context.source, 'cost')),
            new SimpleStep(game, () => this.resolveCosts()),
            new SimpleStep(game, () => this.waitForCostResolution()),
            new SimpleStep(game, () => this.payCosts()),
            new SimpleStep(game, () => this.game.popAbilityContext()),
            new SimpleStep(game, () => this.game.pushAbilityContext('card', context.source, 'effect')),
            new SimpleStep(game, () => this.resolveTargets()),
            new SimpleStep(game, () => this.waitForTargetResolution()),
            new SimpleStep(game, () => this.markActionAsTaken()),
            new SimpleStep(game, () => this.initiateAbility()),
            new SimpleStep(game, () => this.executeHandler()),
            new SimpleStep(game, () => this.raiseCardPlayedIfNotAbility()),
            new SimpleStep(game, () => this.game.popAbilityContext())
        ]);
    }

    setNoNewActions() {
        _.each(this.game.getPlayers(), player => player.canInitiateAction = false);
    }

    markActionAsTaken() {
        if(this.ability.isAction() && !this.cancelled) {
            this.game.markActionAsTaken();
        }
    }

    resolveCosts() {
        if(this.cancelled) {
            return;
        }
        this.context.costs = {};
        this.canPayResults = this.ability.resolveCosts(this.context);
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
        if(this.ability.limit) {
            this.ability.limit.increment();
        }

        this.ability.payCosts(this.context);
    }

    resolveEarlyTargets() {
        if(this.cancelled) {
            return;
        }

        this.context.targets = {};
        if(this.ability.cannotTargetFirst) {
            this.targetResults = _.map(this.ability.targets, (props, name) => {
                return { resolved: false, name: name, value: null, costsFirst: true };
            });
        } else {
            this.targetResults = this.ability.resolveTargets(this.context);
        }
    }

    resolveTargets() {
        if(this.cancelled) {
            return;
        }

        this.targetResults = this.ability.resolveTargets(this.context, this.targetResults);
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
            this.context.targets[result.name] = result.value;
            if(result.name === 'target') {
                this.context.target = result.value;
            }
        });
    }

    initiateAbility() {
        if(this.cancelled) {
            return;
        }
        if(this.ability.isCardAbility()) {
            let targets = _.flatten(_.values(this.context.targets));
            targets = _.filter(targets, target => target instanceof BaseCard);
            this.game.raiseInitiateAbilityEvent({ player: this.context.player, source: this.context.source, resolver: this, targets: targets });
        }
    }

    executeHandler() {
        if(this.cancelled) {
            return;
        }

        this.ability.executeHandler(this.context);
    }

    raiseCardPlayedIfNotAbility() {
        if(!this.ability.isCardAbility() && this.ability.isCardPlayed()) {
            this.game.raiseEvent('onCardPlayed', { player: this.context.player, card: this.context.source, originalLocation: this.ability.originalLocation });
        }
    }
}

module.exports = AbilityResolver;
