const DrawCard = require('../../drawcard.js');

class YogoHiroue extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a character into the conflict',
            condition: () => this.isParticipating(),
            target: {
                cardType: 'character',
                cardCondition: card => card.location === 'play area' && !card.isParticipating() && card.allowGameAction('moveToConflict')
            },
            methods: ['yogoHiroueDelayedEffect'],
            handler: context => {
                this.game.addMessage('{0} uses {1} to move {2} into the conflict', this.controller, this, context.target);
                this.events.register([{ afterConflict: 'yogoHiroueDelayedEffect' }]);
                this.delayedEffectTarget = context.target;
                this.game.currentConflict.moveToConflict(context.target, this.controller === this.game.currentConflict.attackingPlayer);
            }
        });
    }
    
    yogoHiroueDelayedEffect(event) {
        this.events.unregisterAll();
        if(event.conflict.winner === this.controller) {
            this.game.promptWithHandlerMenu(this.controller, {
                activePromptTitle: 'Dishonor ' + this.delayedEffectTarget.name + '?',
                choices: ['Yes', 'No'],
                handlers: [() => this.controller.dishonorCard(this.delayedEffectTarget), () => true],
                source: this
            });
        }
    }
}

YogoHiroue.id = 'yogo-hiroue';

module.exports = YogoHiroue;
