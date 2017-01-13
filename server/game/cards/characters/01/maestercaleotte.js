const DrawCard = require('../../../drawcard.js');

class MaesterCaleotte extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.loser === this.controller && challenge.isParticipating(this)
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select character',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    cardCondition: card => card.location === 'play area' && card.getType() === 'character',
                    onSelect: (p, card) => this.onCardSelected(p, card)
                });
            }
        });
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
        this.untilEndOfPhase(ability => ({
            match: card => card === this.selectedCard,
            effect: ability.effects.removeIcon(icon)
        }));

        return true;
    }
}

MaesterCaleotte.code = '01107';

module.exports = MaesterCaleotte;
