const CardAction = require('./CardGameAction');
const AbilityResolver = require('../gamesteps/abilityresolver.js');
const SimpleStep = require('../gamesteps/simplestep.js');

class NoCostsAbilityResolver extends AbilityResolver {
    initialise() {
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.createSnapshot()),
            new SimpleStep(this.game, () => this.resolveTargets()),
            new SimpleStep(this.game, () => this.initiateAbility()),
            new SimpleStep(this.game, () => this.executeHandler())
        ]);
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
            this.effectMsg = `resolve {0}'s ${this.ability.title ? this.ability.title + ' ' : ''}ability`;
        }
    }

    canAffect(card, context) {
        return this.ability && super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onAction', { card: card, context: context }, () => {
            let newContext = Object.assign(this.ability.createContext(context.player), {
                isResolveAbility: true,
                secondResolution: this.secondResolution
            });
            context.game.queueStep(new NoCostsAbilityResolver(context.game, newContext));
        });
    }
}

module.exports = ResolveAbilityAction;
