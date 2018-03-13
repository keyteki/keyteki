const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class PlayCharacterAction extends BaseAbility {
    constructor() {
        super({
            cost: [
                Costs.chooseFate(),
                Costs.payReduceableFateCost('play'),
                Costs.playLimited(),
                Costs.useInitiateAction()                
            ]
        });
        this.title = 'Play this character';
        this.abilityType = 'action';
        this.cannotBeCancelled = true;
    }

    meetsRequirements(context) {
        return (
            context.game.currentPhase !== 'dynasty' &&
            context.source.getType() === 'character' &&
            context.player.isCardInPlayableLocation(context.source, 'play') &&
            context.source.allowGameAction('putIntoPlay', context) &&
            context.source.canPlay(context) &&
            context.player.canInitiateAction &&
            this.canPayCosts(context)
        );
    }

    executeHandler(context) {
        
        let cardPlayedEvent = {
            name: 'onCardPlayed',
            params: { player: context.player, card: context.source, originalLocation: context.source.location }
        };
        let putIntoPlayHandler = () => {
            context.game.addMessage('{0} plays {1} at home with {2} additional fate', context.player, context.source, context.chooseFate);
            let event = context.game.applyGameAction(context, { putIntoPlay: context.source }, [cardPlayedEvent])[0];
            event.fate = context.chooseFate;
        };
        if(context.source.allowGameAction('putIntoConflict', context)) {
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Where do you wish to play this character?',
                source: context.source,
                choices: ['Conflict', 'Home'],
                handlers: [
                    () => {
                        context.game.addMessage('{0} plays {1} into the conflict with {2} additional fate', context.player, context.source, context.chooseFate);
                        let event = context.game.applyGameAction(context, { putIntoConflict: context.source }, [cardPlayedEvent])[0];
                        event.fate = context.chooseFate;
                    },
                    putIntoPlayHandler
                ]
            });
        } else {
            putIntoPlayHandler();
        }
    }

    isCardPlayed() {
        return true;
    }
}

module.exports = PlayCharacterAction;

