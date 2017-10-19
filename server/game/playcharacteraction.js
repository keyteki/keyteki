const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class PlayCharacterAction extends BaseAbility {
    constructor() {
        super({
            cost: [
                Costs.chooseFate(),
                Costs.payReduceableFateCost('play'),
                Costs.playLimited()
            ]
        });
        this.title = 'Play this character';
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
        this.card.fate = context.chooseFate;
        this.originalLocation = this.card.location;
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
        player.game.addMessage('{0} plays {1} {2}with {3} additional fate', player, this.card, inConflict ? 'into the conflict ' : '', this.card.fate);
        player.putIntoPlay(this.card, inConflict);
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

