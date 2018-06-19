const CardAction = require('./CardGameAction');
const AbilityResolver = require('../gamesteps/abilityresolver.js');
const SimpleStep = require('../gamesteps/simplestep.js');

class NoCostsAbilityResolver extends AbilityResolver {
    initialise() {
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.setAdditionalContext()),
            new SimpleStep(this.game, () => this.createSnapshot()),
            new SimpleStep(this.game, () => this.resolveTargets()),
            new SimpleStep(this.game, () => this.initiateAbility())
        ]);
    }

    setAdditionalContext() {
        this.context.isResolveAbility = true;
    }
}

class ResolveAbilityAction extends CardAction {
    setDefaultProperties() {
        this.ability = null;
    }

    setup() {
        super.setup();
        this.name = 'resolveAbility';
        this.effectMsg = 'resolve {0}\'s ' + this.ability.title + ' ability';
    }

    canAffect(card, context) {
        return this.ability && super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('unnamedEvent', { card: card, context: context }, () => {
            context.game.queueStep(new NoCostsAbilityResolver(context.game, this.ability.createContext(context.player)));
        });
    }
}

module.exports = ResolveAbilityAction;
