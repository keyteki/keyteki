const DrawCard = require('../../../drawcard.js');
 
class SeaBitch extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Sacrifice this card',
            method: 'sacrifice'
        });
    }    

    sacrifice(player) {
        if(this.location !== 'play area') {
            return false;
        }
        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select location to take control of',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
    }

    cardCondition(card) {
        return card.getType() === 'location' && card.location === 'play area' && card.owner !== this.owner && !card.hasKeyword('Limited');
    }

    onCardSelected(player, card) {      
        this.untilEndOfPhase(ability => ({
            targetController: 'opponent',
            match:  card,
            effect: ability.effects.takeControl(player)
        }));
        this.game.addMessage('{0} sacrifices {1} to take control of {2} until the end of the phase', player, this, card);
        this.controller.sacrificeCard(this);
        return true;
    }
}

SeaBitch.code = '04112';

module.exports = SeaBitch;
