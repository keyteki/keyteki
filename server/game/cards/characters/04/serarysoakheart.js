const DrawCard = require('../../../drawcard.js');

class SerArysOakheart extends DrawCard {
    setupCardAbilities() {  
        this.reaction({
            when: {
                onCardEntersPlay: (e, card) => card === this && this.controller.gold >= 2
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => (
                        card.location === 'play area' && 
                        card.getType() === 'character' && 
                        card.hasTrait('Ally')),
                    activePromptTitle: 'Select a character',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    onSelect: (player, card) => {
                        card.controller.discardCard(card);
                        this.controller.gold -= 2;
                        this.game.addMessage('{0} uses {1} to discard {2} from play', player, this, card);
                    }
                });
            }
        });
    }
}

SerArysOakheart.code = '04115';

module.exports = SerArysOakheart;
