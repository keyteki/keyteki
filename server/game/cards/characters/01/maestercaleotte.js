const DrawCard = require('../../../drawcard.js');

class MaesterCaleotte extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge']);

        this.abilityUsed = 0;
    }

    afterChallenge(event, challenge) {
        if(challenge.winner === this.controller || !challenge.isParticipating(this)) {
            return;
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'takeIcon' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });   
    }

    takeIcon(player) {      
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && card.getType() === 'character',
            onSelect: (p, card) => this.onCardSelected(p, card)
        });

        return true;        
    }

    onCardSelected(player, card) {
        this.selectedCard = card;

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Select an icon to remove',
                buttons: [
                    { text: 'Military', method: 'iconSelected', arg: 'military' },
                    { text: 'Intrigue', method: 'iconSelected', arg: 'intrigue' },
                    { text: 'Power', method: 'iconSelected', arg: 'power' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        }); 

        return true;
    }
    
    iconSelected(player, icon) {
        this.game.addMessage('{0} uses {1} to remove a {2} icon from {3}', player, this, icon, this.selectedCard);
        this.selectedIcon = icon;

        this.selectedCard.removeIcon(icon);

        this.game.once('onPhaseEnded', () => {
            this.onPhaseEnded();
        });

        return true;
    }

    onPhaseEnded() {
        if(this.selectedCard) {
            this.selectedCard.addIcon(this.selectedIcon);
            this.selectedCard = undefined;
        }
    }
}

MaesterCaleotte.code = '01107';

module.exports = MaesterCaleotte;
