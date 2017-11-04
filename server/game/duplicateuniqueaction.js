const BaseAbility = require('./baseability.js');

class DuplicateUniqueAction extends BaseAbility {
    constructor() {
        super({ cost: null });
        this.title = 'DuplicateUniqueAction';
    }

    meetsRequirements(context) {
        var {game, player, source} = context;

        return (
            game.currentPhase === 'dynasty' &&
            !source.facedown &&
            source.getType() === 'character' &&
            (player.isCardInPlayableLocation(context.source, 'dynasty') || player.isCardInPlayableLocation(context.source, 'hand')) &&
            !player.canPutIntoPlay(source) &&
            player.canInitiateAction
        );
    }
    
    executeHandler(context) {
        let duplicate = context.player.getDuplicateInPlay(context.source);
        duplicate.modifyFate(1);
        
        context.game.addMessage('{0} discards a duplicate to add 1 fate to {1}', context.player, context.source.name);
        context.player.moveCard(context.source, context.source.isDynasty ? 'dynasty discard pile' : 'conflict discard pile');
    }

    isCardAbility() {
        return false;
    }
}

module.exports = DuplicateUniqueAction;

