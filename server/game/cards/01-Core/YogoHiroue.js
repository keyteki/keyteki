const DrawCard = require('../../drawcard.js');

class YogoHiroue extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a character into the conflict',
            condition: () => this.isParticipating(),
            target: {
                cardType: 'character',
                gameAction: 'moveToConflict',
                cardCondition: card => card.location === 'play area' && !card.isParticipating()
            },
            methods: ['yogoHiroueDelayedEffect'],
            handler: context => {
                this.game.addMessage('{0} uses {1} to move {2} into the conflict', this.controller, this, context.target);
                this.events.register([{ afterConflict: 'yogoHiroueDelayedEffect' }]);
                this.delayedEffectTarget = context.target;
                this.game.currentConflict.moveToConflict(context.target);
            }
        });
    }
    
    yogoHiroueDelayedEffect(event) {
        this.events.unregisterAll();
        if(event.conflict.winner === this.controller && this.delayedEffectTarget.location === 'play area' && this.delayedEffectTarget.allowGameAction('dishonor')) {
            this.game.promptWithHandlerMenu(this.controller, {
                activePromptTitle: 'Dishonor ' + this.delayedEffectTarget.name + '?',
                choices: ['Yes', 'No'],
                handlers: [
                    () => {
                        this.controller.dishonorCard(this.delayedEffectTarget, this);
                        this.game.addMessage('{0} chooses to dishonor {1} due to {2}\'s delayed effect', this.controller, this.delayedEffectTarget, this);
                    }, () => true
                ],
                source: this
            });
        }
    }
}

YogoHiroue.id = 'yogo-hiroue';

module.exports = YogoHiroue;
