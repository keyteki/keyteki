const DrawCard = require('../../drawcard.js');

class RadiantOrator extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Send a character home',
            condition: () => {
                if(!this.controller.opponent) {
                    return false;
                }
                let myGlory = this.controller.cardsInPlay.reduce((total, card) => card.isParticipating() && !card.bowed ? card.getGlory() + total : total, 0);
                let oppGlory = this.controller.opponent.cardsInPlay.reduce((total, card) => card.isParticipating() && !card.bowed ? card.getGlory() + total : total, 0);
                return (this.isParticipating() && myGlory > oppGlory);
            },
            target: {
                cardType: 'character',
                gameAction: 'sendHome',
                cardCondition: card => card.controller !== this.controller && card.isParticipating()
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to send {2} home', this.controller, this, context.target);
                this.game.currentConflict.sendHome(context.target);
            }
        });
    }
}

RadiantOrator.id = 'radiant-orator';

module.exports = RadiantOrator;
