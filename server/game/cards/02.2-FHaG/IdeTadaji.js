const DrawCard = require('../../drawcard.js');

class IdeTadaji extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move characters into conflict',
            condition: () => this.isParticipating() && this.controller.opponent,
            targets: {
                myChar: {
                    cardType: 'character',
                    gameAction: 'moveToConflict',
                    cardCondition: card => (card.location === 'play area' && !card.isParticipating() && !card.bowed && 
                        card.controller === this.controller && card.getCost() < 3)
                },
                oppChar: {
                    cardType: 'character',
                    gameAction: 'moveToConflict',
                    cardCondition: card => (card.location === 'play area' && !card.isParticipating() && !card.bowed && 
                        card.controller !== this.controller && card.getCost() < 3)                    
                }                
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to move {2} and {3} into the conflict', this.controller, this, context.targets.myChar, context.targets.oppChar);
                this.game.currentConflict.moveToConflict([context.targets.myChar, context.targets.oppChar])
            }
        });
    }
}

IdeTadaji.id = 'ide-tadaji';

module.exports = IdeTadaji;
