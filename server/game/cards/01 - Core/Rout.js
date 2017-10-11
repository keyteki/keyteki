const DrawCard = require('../../drawcard.js');

class Rout extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Choose a character – send it home.',
            condition: () => this.game.currentConflict,
            target: {
                activePromptTitle: 'Select a character',
                cardType: 'character',
                cardCondition: card => card.location === 'play area' && card.controller !== this.controller && card.getMilitarySkill() < this.getStrongestBushi()
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to send {2} home', this.controller, this, context.target);
                this.game.currentConflict.sendHome(context.target);
            }
        });
    }

    hasBushiPresent() {
        return false;
    }

    getStrongestBushi() {
        return 10;
        //TODO: Get the strongest bushi character in the conflict.
    }
}

Rout.id = 'rout';

module.exports = Rout;
