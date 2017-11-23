const ProvinceCard = require('../../provincecard.js');

class RiotInTheStreets extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow character if you have 3 participating bushi',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictProvince === this && 
                this.controller.getNumberOfCardsInPlay(card => card.hasTrait('bushi') && card.isParticipating()) >= 3,
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                gameAction: 'bow',
                cardCondition: card => card.isParticipating()
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to bow {2}', this.controller, this, context.target);
                this.controller.bowCard(context.target, context.source);
            }
        });
    }
}

RiotInTheStreets.id = 'riot-in-the-streets';

module.exports = RiotInTheStreets;
