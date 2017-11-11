const DrawCard = require('../../drawcard.js');

class EmbraceTheVoid extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Take Fate',
            when: {
                onCardRemoveFate: event => event.card === this.parent && event.fate > 0
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to take the {2} fate being removed from {3}', this.controller, this, context.event.fate, this.parent);
                context.event.recipient = this.controller;
            }
        });
    }
    
    canPlay() {
        if(!this.controller.cardsInPlay.any(card => card.getType() === 'character' && card.hasTrait('shugenja'))) {
            return false;
        }
        
        return super.canPlay();
    }
}

EmbraceTheVoid.id = 'embrace-the-void';

module.exports = EmbraceTheVoid;
