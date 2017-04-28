const DrawCard = require('../../../drawcard.js');

class GreenDreams extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardKneeled: (e, player, card) => card === this.parent
            },
            handler: () => {
                this.topCard = this.controller.drawDeck.first();
                this.game.addMessage('{0} uses {1} to look at the top card of their deck', this.controller, this);

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Put ' + this.topCard.name + ' on bottom of your deck?',
                        buttons: [
                            { text: 'Yes', method: 'placeOnBottom', arg: 'yes', card: this.topCard },
                            { text: 'No', method: 'placeOnBottom', arg: 'no', card: this.topCard }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    placeOnBottom(player, arg) {
        if(arg === 'no') {
            this.game.addMessage('{0} declines to use {1} to move the top card of their deck to the bottom', this.controller, this);
            return true;
        }

        this.controller.moveCard(this.topCard, 'draw deck', { bottom: true });
        this.game.addMessage('{0} uses {1} to move the top card of their deck to the bottom', this.controller, this);

        return true;
    }
}

GreenDreams.code = '03043';

module.exports = GreenDreams;
