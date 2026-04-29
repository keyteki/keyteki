const AbilityContext = require('../AbilityContext');
const BaseAbility = require('../baseability.js');
const Costs = require('../costs.js');
const { EVENTS } = require('../Events/types');

class RemoveStun extends BaseAbility {
    constructor(card) {
        super({ cost: [Costs.use(), Costs.exhaust()] });
        this.card = card;
        this.abilityType = 'action';
        this.title = "Remove this creature's stun";
        this.printedAbility = false;
        this.omni = false;
        this.unstun = true;
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements) {
        if (
            !this.card.checkRestrictions('use', context) ||
            !context.player.checkRestrictions('use', context)
        ) {
            return 'cannotTrigger';
        } else if (
            !ignoredRequirements.includes('location') &&
            this.card.location !== 'play area'
        ) {
            return 'location';
        } else if (!ignoredRequirements.includes('stunned') && !this.card.stunned) {
            return 'stunned';
        }

        return super.meetsRequirements(context, ignoredRequirements);
    }

    createContext(player = this.card.controller) {
        return new AbilityContext({
            ability: this,
            game: this.card.game,
            player: player,
            source: this.card
        });
    }

    executeHandler(context) {
        context.game.addMessage(
            '{0} exhausts {1} to remove its stun',
            context.player,
            context.source
        );
        context.game.raiseEvent(EVENTS.onRemoveStun, { card: this.card, context: context }, () => {
            context.source.unstun();
            context.game.raiseEvent(EVENTS.onUseCard, {
                card: this.card,
                context: context,
                unstun: true
            });
        });
    }

    isAction() {
        return true;
    }
}

module.exports = RemoveStun;
