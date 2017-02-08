const DrawCard = require('../../../drawcard.js');

class SerIlynPayne extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Kneel Ser Ilyn Payne to kill a character',
            method: 'kneel'
        });
    }
    
    kneel(player) {
        if(this.controller !== player || this.location !== 'play area' || this.kneeled || player.phase !== 'marshal') {
        return false;
        }
      
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.getCost() <= 3,
            onSelect: (p, card) => this.onCardSelected(p, card)
        });

        return true;
    }
    
    onCardSelected(player, card) {
        this.game.addMessage('{0} kneels {1} to kill {2}', player, this, card);
        this.controller.kneelCard(this);
        card.controller.killCharacter(card);

        return true;
    }
}

SerIlynPayne.code = '02109';

module.exports = SerIlynPayne;
