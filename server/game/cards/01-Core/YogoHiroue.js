const DrawCard = require('../../drawcard.js');

class YogoHiroue extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a character into the conflict',
            condition: () => this.isParticipating(),
            target: {
                cardType: 'character',
                gameAction: 'moveToConflict'
            },
            methods: ['yogoHiroueDelayedEffect'],
            handler: context => {
                this.game.addMessage('{0} uses {1} to move {2} into the conflict', this.controller, this, context.target);
                this.events.register([{ afterConflict: 'yogoHiroueDelayedEffect' }]);
                this.delayedEffectContext = context;
                this.game.applyGameAction(context, { moveToConflict: context.target });
            }
        });
    }
    
    yogoHiroueDelayedEffect(event) {
        this.events.unregisterAll();
        if(event.conflict.winner === this.controller && this.delayedEffectContext.target.allowGameAction('dishonor')) {
            this.game.promptWithHandlerMenu(this.controller, {
                activePromptTitle: 'Dishonor ' + this.delayedEffectContext.target.name + '?',
                choices: ['Yes', 'No'],
                handlers: [
                    () => {
                        this.game.addMessage('{0} chooses to dishonor {1} due to {2}\'s delayed effect', this.controller, this.delayedEffectContext.target, this);
                        this.game.applyGameAction(this.delayedEffectContext, { dishonor: this.delayedEffectContext.target });
                    },
                    () => true
                ],
                source: this
            });
        }
    }
}

YogoHiroue.id = 'yogo-hiroue';

module.exports = YogoHiroue;
