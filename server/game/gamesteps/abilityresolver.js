const _ = require('underscore');

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
            new SimpleStep(this.game, () => this.resolveEarlyTargets()),
            new SimpleStep(this.game, () => this.checkForCancel()),
            new SimpleStep(this.game, () => this.resolveCosts()),
            new SimpleStep(this.game, () => this.payCosts()),
            new SimpleStep(this.game, () => this.checkCostsWerePaid()),
            new SimpleStep(this.game, () => this.resolveTargets()),
            new SimpleStep(this.game, () => this.initiateAbility())
        ]);

    }

    createSnapshot() {
        if(['character', 'holding', 'attachment'].includes(this.context.source.getType())) {
            this.context.cardStateWhenInitiated = this.context.source.createSnapshot();
        }
    }

    resolveEarlyTargets() {
        if(this.cancelled) {
            return;
        }
        this.context.stage = 'pretarget';
        if(!this.context.ability.cannotTargetFirst) {
            this.targetResults = this.context.ability.resolveTargets(this.context);
        }
    }

    checkForCancel() {
        if(this.cancelled) {
            return;
        }

        this.cancelled = this.targetResults.cancelled;
    }

    resolveCosts() {
        if(this.cancelled) {
            return;
        }
        this.canPayResults = {
            cancelled: false,
            canCancel: this.canCancel
        };
        this.context.stage = 'costs';
        this.context.ability.resolveCosts(this.context, this.canPayResults);
    }

    payCosts() {
        if(this.cancelled) {
            return;
        } else if(this.canPayResults.cancelled) {
            this.cancelled = true;
            return;
        }
        this.costEvents = this.context.ability.payCosts(this.context);
        if(this.costEvents.length > 0) {
            this.game.openEventWindow(this.costEvents);
        }
    }

    checkCostsWerePaid() {
        if(this.cancelled) {
            return;
        }
        this.cancelled = _.any(this.costEvents, event => {
            let result = event.getResult();
            return !result.resolved || result.cancelled;
        });

        if(this.cancelled) {
            this.game.addMessage('{0} attempted to use {1}, but did not successfully pay the required costs', this.context.player, this.context.source);
        }
    }


    resolveTargets() {
        if(this.cancelled) {
            return;
        }
        this.context.stage = 'target';


        if(!this.context.ability.hasLegalTargets(this.context)) {
            // Ability cannot resolve, so display a message and cancel it
            this.game.addMessage('{0} attempted to use {1}, but there are insufficient legal targets', this.context.player, this.context.source);
            this.cancelled = true;
        } else if(this.targetResults.delayTargeting) {
            // Targeting was delayed due to an opponent needing to choose targets (which shouldn't happen until costs have been paid), so continue
            this.context.ability.resolveRemainingTargets(this.context, this.targetResults.delayTargeting);
        } else if(this.targetResults.payCostsFirst || !this.context.ability.checkAllTargets(this.context)) {
            // Targeting was stopped by the player choosing to pay costs first, or one of the chosen targets is no longer legal. Retarget from scratch
            this.context.ability.resolveTargets(this.context);
        }
    }

    initiateAbility() {
        if(this.cancelled) {
            return;
        }

        // Increment limits (limits aren't used up on cards in hand)
        if(this.context.ability.limit && this.context.source.location !== 'hand' &&
           (!this.context.cardStateWhenInitiated || this.context.cardStateWhenInitiated.location === this.context.source.location)) {
            this.context.ability.limit.increment(this.context.player);
        }
        if(this.context.ability.max) {
            this.context.player.incrementAbilityMax(this.context.ability.maxIdentifier);
        }

        this.context.ability.displayMessage(this.context);

        // If this is a card ability, raise an initiateAbilityEvent
        if(this.context.ability.isCardAbility()) {
            // If this is an event, move it to 'being played', and queue a step to send it to the discard pile after it resolves
            if(this.context.source.type === 'event') {
                this.context.player.moveCard(this.context.source, 'being played');
                this.game.raiseInitiateAbilityEvent({ card: this.context.source, context: this.context }, () => this.executeCardAbilityHandler());
                this.game.queueSimpleStep(() => this.context.player.moveCard(this.context.source, 'conflict discard pile'));
            } else {
                this.game.raiseInitiateAbilityEvent({ card: this.context.source, context: this.context }, () => this.executeCardAbilityHandler());
            }
        } else {
            this.executeHandler();
        }
    }

    executeCardAbilityHandler() {
        // create an event window for the handler to add events to
        this.game.raiseEvent('onAbilityResolved', { card: this.context.source, context: this.context }, () => {
            this.executeHandler();
        });

    }

    executeHandler() {
        this.context.stage = 'effect';
        this.context.ability.executeHandler(this.context);
    }
}

module.exports = AbilityResolver;
