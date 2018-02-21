const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class DynastyCardAction extends BaseAbility {
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
        var {game, player, source} = context;

        this.originalLocation = source.location;
        return (
            game.currentPhase === 'dynasty' &&
            source.isDynasty &&
            !source.facedown &&
            source.getType() === 'character' &&
            player.isCardInPlayableLocation(source, 'dynasty') &&
            source.allowGameAction('putIntoPlay', context) &&
            source.canPlay(context) &&
            player.canInitiateAction &&
            this.canPayCosts(context)
        );
    }

    executeHandler(context) {
        context.game.addMessage('{0} plays {1} with {2} additional fate', context.player, context.source, context.chooseFate);
        let events = context.game.applyGameAction(context, { putIntoPlay: context.source }, [{
            name: 'onCardPlayed',
            params: { player: context.player, card: context.source, originalLocation: context.source.location }
        }]);
        events[0].fate = context.chooseFate;
    }

    isCardPlayed() {
        return true;
    }
}

module.exports = DynastyCardAction;
