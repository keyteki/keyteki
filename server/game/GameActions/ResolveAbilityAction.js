const CardAction = require('./CardGameAction');
const AbilityResolver = require('../gamesteps/abilityresolver.js');
const SimpleStep = require('../gamesteps/simplestep.js');

class NoCostsAbilityResolver extends AbilityResolver {
    initialise() {
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.createSnapshot()),
            new SimpleStep(this.game, () => this.resolveTargets()),
            new SimpleStep(this.game, () => this.initiateAbility())
        ]);
    }

    initiateAbility() {
        if(this.cancelled) {
            return;
        } else if(this.context.ability.max && !this.context.secondResolution) {
            this.context.player.incrementAbilityMax(this.context.ability.maxIdentifier);
        }
        this.context.ability.displayMessage(this.context);
        let handler = this.context.secondResolution ? () => this.executeHandler() : () => this.executeCardAbilityHandler();
        this.game.raiseInitiateAbilityEvent({ card: this.context.source, context: this.context }, handler);
    }
}

class ResolveAbilityAction extends CardAction {
    setDefaultProperties() {
        this.ability = null;
        this.secondResolution = false;
    }

    setup() {
        super.setup();
        this.name = 'resolveAbility';
        if(this.ability) {
            this.effectMsg = 'resolve {0}\'s ' + this.ability.title + ' ability';
        }
    }

    canAffect(card, context) {
        return this.ability && super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('unnamedEvent', { card: card, context: context }, () => {
            let newContext = Object.assign(this.ability.createContext(context.player), {
                isResolveAbility: true,
                secondResolution: this.secondResolution
            });
            context.game.queueStep(new NoCostsAbilityResolver(context.game, newContext));
        });
    }
}

module.exports = ResolveAbilityAction;
