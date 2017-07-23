const _ = require('underscore');

const BaseStep = require('./basestep.js');
const GamePipeline = require('../gamepipeline.js');
const SimpleStep = require('./simplestep.js');

class AbilityResolver extends BaseStep {
    constructor(game, ability, context) {
        super(game);

        this.ability = ability;
        this.context = context;
        this.pipeline = new GamePipeline();
        this.pipeline.initialise([
            new SimpleStep(game, () => this.markActionAsTaken()),
            new SimpleStep(game, () => this.game.pushAbilityContext('card', context.source, 'cost')),
            new SimpleStep(game, () => this.resolveCosts()),
            new SimpleStep(game, () => this.waitForCostResolution()),
            new SimpleStep(game, () => this.payCosts()),
            new SimpleStep(game, () => this.game.popAbilityContext()),
            new SimpleStep(game, () => this.game.pushAbilityContext('card', context.source, 'effect')),
            new SimpleStep(game, () => this.resolveTargets()),
            new SimpleStep(game, () => this.waitForTargetResolution()),
            new SimpleStep(game, () => this.executeHandler()),
            new SimpleStep(game, () => this.raiseCardPlayedIfEvent()),
            new SimpleStep(game, () => this.game.popAbilityContext())
        ]);
    }

    queueStep(step) {
        this.pipeline.queueStep(step);
    }

    isComplete() {
        return this.pipeline.length === 0;
    }

    onCardClicked(player, card) {
        return this.pipeline.handleCardClicked(player, card);
    }

    onMenuCommand(player, arg, method) {
        return this.pipeline.handleMenuCommand(player, arg, method);
    }

    cancelStep() {
        this.pipeline.cancelStep();
    }

    continue() {
        try {
            return this.pipeline.continue();
        } catch(e) {
            this.game.reportError(e);

            let currentAbilityContext = this.game.currentAbilityContext;
            if(currentAbilityContext && currentAbilityContext.source === 'card' && currentAbilityContext.card === this.context.source) {
                this.game.popAbilityContext();
            }

            return true;
        }
    }

    markActionAsTaken() {
        if(this.ability.isAction()) {
            this.game.markActionAsTaken();
        }
    }

    resolveCosts() {
        this.context.costs = {};
        this.canPayResults = this.ability.resolveCosts(this.context);
    }

    waitForCostResolution() {
        this.cancelled = _.any(this.canPayResults, result => result.resolved && !result.value);

        if(!_.all(this.canPayResults, result => result.resolved)) {
            return false;
        }
    }

    payCosts() {
        if(this.cancelled) {
            return;
        }

        this.ability.payCosts(this.context);
    }

    resolveTargets() {
        if(this.cancelled) {
            return;
        }

        this.context.targets = {};
        this.targetResults = this.ability.resolveTargets(this.context);
    }

    waitForTargetResolution() {
        if(this.cancelled) {
            return;
        }

        this.cancelled = _.any(this.targetResults, result => result.resolved && !result.value);

        if(!_.all(this.targetResults, result => result.resolved)) {
            return false;
        }

        _.each(this.targetResults, result => {
            this.context.targets[result.name] = result.value;
            if(result.name === 'target') {
                this.context.target = result.value;
            }
        });
    }

    executeHandler() {
        if(this.cancelled) {
            return;
        }

        // Check to make sure the ability is actually a card ability. For
        // instance, marshaling does not count as initiating a card ability and
        // thus is not subject to cancels such as Treachery.
        if(this.ability.isCardAbility()) {
            this.game.raiseMergedEvent('onCardAbilityInitiated', { player: this.context.player, source: this.context.source }, () => {
                this.ability.executeHandler(this.context);
            });
        } else {
            this.ability.executeHandler(this.context);
        }
    }

    raiseCardPlayedIfEvent() {
        // An event card is considered to be played even if it has been
        // cancelled. Raising the event here will allow forced reactions and
        // reactions to fire with the appropriate timing. There are no cards
        // with an interrupt to a card being played. If any are ever released,
        // then this event will need to wrap the execution of the entire
        // ability instead.
        if(this.ability.isPlayableEventAbility()) {
            this.game.raiseEvent('onCardPlayed', this.context.player, this.context.source);
        }
    }
}

module.exports = AbilityResolver;
