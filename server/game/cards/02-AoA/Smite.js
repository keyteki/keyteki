const Card = require('../../Card.js');
const FightGameAction = require('../../GameActions/FightGameAction');
const AbilityResolver = require('../../gamesteps/abilityresolver');
const SimpleStep = require('../../gamesteps/simplestep');

class SmiteAbilityResolver extends AbilityResolver {
    // Play: Ready and fight with a friendly creature. Deal 2D to the attacked creatures neighbors.
    initialise() {
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.createSnapshot()),
            new SimpleStep(this.game, () => this.payCosts()),
            new SimpleStep(this.game, () => this.resolveTargets()),
            new SimpleStep(this.game, () => this.getNeighbors()),
            new SimpleStep(this.game, () => this.initiateAbility()),
            new SimpleStep(this.game, () => this.executeHandler()),
            new SimpleStep(this.game, () => this.raiseResolvedEvent()),
            new SimpleStep(this.game, () => this.damageNeighbors())
        ]);
    }

    getNeighbors() {
        if (this.cancelled) {
            return;
        }

        if (!this.context.target) {
            return;
        }

        this.neighbors = this.context.target.neighbors;
    }

    damageNeighbors() {
        if (this.cancelled || !this.neighbors) {
            return;
        }

        this.game.actions.dealDamage({ amount: 2 }).resolve(this.neighbors, this.context);
    }
}

class SmiteFightAction extends FightGameAction {
    getEvent(card, context) {
        return super.createEvent('onInitiateFight', { card, context }, () => {
            let newContext;
            if (card.stunned) {
                let removeStunAction = card
                    .getActions()
                    .find((action) => action.title === "Remove this creature's stun");
                newContext = removeStunAction.createContext(context.player);
            } else {
                let fightAction = card.getFightAction();
                newContext = fightAction.createContext(context.player);
            }

            newContext.canCancel = false;
            context.game.queueStep(new SmiteAbilityResolver(context.game, newContext));
        });
    }
}

class Smite extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    new SmiteFightAction()
                ])
            },
            effect: 'ready and fight with {0}'
        });
    }
}

Smite.id = 'smite';

module.exports = Smite;
