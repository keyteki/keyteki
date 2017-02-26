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
                    source: this,
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
            source: this
        });

        return true;
    }

    iconSelected(player, icon) {
        this.game.addMessage('{0} uses {1} to remove a {2} icon from {3}', player, this, icon, this.selectedCard);
        this.untilEndOfPhase(ability => ({
            match: this.selectedCard,
            effect: ability.effects.removeIcon(icon)
        }));

        return true;
    }
}

MaesterCaleotte.code = '01107';

module.exports = MaesterCaleotte;
