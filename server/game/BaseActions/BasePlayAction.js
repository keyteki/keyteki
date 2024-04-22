const AbilityContext = require('../AbilityContext');
const BaseAbility = require('../baseability.js');
const Costs = require('../costs.js');

class BasePlayAction extends BaseAbility {
    constructor(card, target) {
        let properties = { cost: Costs.play() };
        if (target) {
            properties.target = target;
        }

        super(properties);
        this.card = card;
        this.abilityType = 'action';
    }

    displayMessage(context) {
        context.game.addMessage('{0} plays {1}', context.player, context.source);
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if (
            !ignoredRequirements.includes('location') &&
            !context.player.isCardInPlayableLocation(context.source, 'play')
        ) {
            return 'location';
        } else if (
            !ignoredRequirements.includes('cannotTrigger') &&
            (!context.player.checkRestrictions('play', context) ||
                !context.source.checkRestrictions('play', context))
        ) {
            return 'cannotTrigger';
        }

        return super.meetsRequirements(context);
    }

    createContext(player = this.card.controller) {
        return new AbilityContext({
            ability: this,
            game: this.card.game,
            player: player,
            source: this.card
        });
    }

    addSubEvent(event, context) {
        let bonusEvent = context.game.getEvent('unnamedEvent', {}, () => {
            context.game.checkGameState(true);
            // update game state to consider effects
            if (context.source.hasKeyword('omega')) {
                context.game.omegaCard = context.source;
            }
            context.game.actions.resolveBonusIcons().resolve(context.source, context);
        });
        bonusEvent.addSubEvent(
            context.game.getEvent(
                'onCardPlayedAfterBonusIcons',
                {
                    player: context.player,
                    card: context.source
                },
                () => {
                    // Resolving the bonus icons might change the
                    // ability events possible from this card, so
                    // re-evaluate them here.
                    context.source.updateAbilityEvents('hand', 'being played');
                }
            )
        );
        event.addSubEvent(bonusEvent);
    }

    executeHandler(context) {
        let event = context.game.getEvent(
            'onCardPlayed',
            {
                player: context.player,
                card: context.source,
                originalLocation: context.source.location
            },
            () => context.game.cardPlayed(context.source)
        );
        this.addSubEvent(event, context);
        context.game.openEventWindow(event);
    }

    isAction() {
        return true;
    }

    isCardPlayed() {
        return true;
    }
}

module.exports = BasePlayAction;
