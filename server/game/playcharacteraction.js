const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');
const ChooseFate = require('./costs/choosefate.js');

class PlayCharacterAction extends BaseAbility {
    constructor() {
        super({
            cost: [
                new ChooseFate(),
                Costs.payReduceableFateCost('play'),
                Costs.playLimited()
            ]
        });
        this.title = 'PlayCharacterAction';
        this.card = undefined;
    }

    meetsRequirements(context) {
        return (
            context.game.currentPhase !== 'dynasty' &&
            context.source.getType() === 'character' &&
            context.source.location === 'hand' &&
            context.source.canPlay()
        );
    }

    executeHandler(context) {
        
        this.card = context.source;
        if(context.game.currentConflict) {
            context.game.promptWithMenu(context.player, this, {
                activePrompt: {
                    promptTitle: context.source.name,
                    menuTitle: 'Where do you wish to play this character?',
                    buttons: [
                        { text: 'Conflict', arg: 'conflict', method: 'playCharacterWithFate' },
                        { text: 'Home', arg: 'home', method: 'playCharacterWithFate' }
                    ]
                },
                waitingPromptTitle: 'Waiting for opponent to take an action or pass.'
            });
        } else {
            this.playCharacterWithFate(context.player, 'home');
        }
    }
    
    playCharacterWithFate(player, arg) {
        let inConflict = false;
        if(arg === 'conflict') {
            inConflict = true;
        }
        player.playCharacterWithFate(this.card, this.cost[0].fate, inConflict);
        return true;
    }

    isCardPlayed() {
        return true;
    }

    isCardAbility() {
        return false;
    }
}

module.exports = PlayCharacterAction;

