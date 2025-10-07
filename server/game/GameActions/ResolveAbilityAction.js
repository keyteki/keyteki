import CardAction from './CardGameAction.js';
import AbilityResolver from '../gamesteps/abilityresolver.js';
import SimpleStep from '../gamesteps/simplestep.js';

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
        if (this.ability) {
            this.effectMsg = `resolve {0}'s ${
                this.ability.title ? this.ability.title + ' ' : ''
            }ability`;
        } else {
            this.effectMsg = 'resolve an ability on {0}';
        }
    }

    getEvent(card, context) {
        return super.createEvent('onAction', { card: card, context: context }, () => {
            let ability = this.ability;
            if (typeof ability === 'function') {
                let cardAbilites = card.actions.concat(card.reactions);
                let filteredAbilities = cardAbilites.filter(
                    (a) => ability(a) && a.condition(context)
                );
                if (filteredAbilities.length > 1) {
                    let choices = [];
                    let handlers = [];
                    for (let a of filteredAbilities) {
                        const generatingEffect = context.game.effectEngine.effects.find(
                            (effect) => effect.effect.getValue(card) === a
                        );
                        if (generatingEffect) {
                            choices.push(generatingEffect.source.name);
                        } else {
                            choices.push(card.name);
                        }
                        handlers.push(() => (ability = a));
                    }

                    if (choices.length === 0) {
                        return;
                    } else if (choices.length === 1) {
                        handlers[0]();
                    } else {
                        context.game.promptWithHandlerMenu(context.game.activePlayer, {
                            activePromptTitle: 'Resolve ability from:',
                            context: context,
                            choices: choices,
                            handlers: handlers
                        });
                    }
                } else {
                    ability = filteredAbilities[0];
                }
            }

            context.game.queueSimpleStep(() => {
                if (ability && ability.condition(context)) {
                    let newContext = Object.assign(ability.createContext(context.player), {
                        isResolveAbility: true,
                        secondResolution: this.secondResolution
                    });
                    context.game.queueStep(new NoCostsAbilityResolver(context.game, newContext));
                }
            });
        });
    }
}

export default ResolveAbilityAction;
