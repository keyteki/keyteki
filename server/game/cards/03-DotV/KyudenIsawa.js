const StrongholdCard = require('../../strongholdcard.js');
const AbilityResolver = require('../../gamesteps/abilityresolver');

class KyudenIsawaResolver extends AbilityResolver {
    constructor(game, context, kyudenContext, kyudenCard) {
        super(game, context);
        this.kyudenContext = kyudenContext;
        this.kyudenCard = kyudenCard;
        this.cancelPressed = false;
    }

    resolveCosts() {
        if(this.cancelled) {
            this.kyudenCard.chooseSpell(this.kyudenContext);
            this.cancelPressed = true;
        }
        super.resolveCosts();
    }

    initiateAbility() {
        super.initiateAbility();
        if(!this.cancelPressed) {
            this.game.queueSimpleStep(() => {
                this.game.addMessage('{0} is removed from the game by {1}\'s ability', this.context.source, this.kyudenContext.source);
                this.context.player.moveCard(this.context.source, 'removed from game');
            });
        }
    }
}


class KyudenIsawa extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Play a spell event from discard',
            cost: ability.costs.bowSelf(),
            condition: context => this.game.isDuringConflict() && context.player.conflictDiscardPile.any(card => {
                if(card.type !== 'event' || !card.hasTrait('spell')) {
                    return false;
                }
                return card.abilities.actions.some(action => {
                    let reason = action.meetsRequirements();
                    return reason === '' || reason === 'location';
                });
            }),
            effect: 'play a spell event from discard',
            handler: context => this.chooseSpell(context)
        });
    }

    chooseSpell(context) {
        this.game.promptForSelect(context.player, {
            activePromptTitle: 'Choose a spell event',
            cardType: 'event',
            location: 'conflict discard pile',
            controller: 'self',
            context: context,
            cardCondition: card => card.hasTrait('spell') && card.abilities.actions.some(action => {
                let reason = action.meetsRequirements();
                return reason === '' || reason === 'location';
            }),
            onSelect: (player, card) => {
                // TODO: make this work for events with multiple actions
                this.resolveSpell(context, card.abilities.actions[0]);
                return true;
            }
        });
    }

    resolveSpell(context, ability) {
        this.game.queueStep(new KyudenIsawaResolver(this.game, ability.createContext(context.player), context, this));
    }
}

KyudenIsawa.id = 'kyuden-isawa';

module.exports = KyudenIsawa;
