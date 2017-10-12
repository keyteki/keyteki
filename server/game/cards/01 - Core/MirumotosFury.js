const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class MirumotosFury extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow attacking character',
            condition: () => this.game.currentConflict,
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                cardCondition: card => this.game.currentConflict.isParticipating(card) && card.getGlory() <= _.size(this.game.allCards.filter(card => card.isProvince && card.facedown && card.controller === this.controller))
            },
            handler: context => {
                let tmp = _.size(this.game.allCards.filter(card => card.isProvince && card.facedown && card.controller === this.controller));
                this.game.addMessage('{0} uses {1} to bow {2} with glory {3} unrev {4}', this.controller, this, context.target, tmp), context.target.getGlory();
                this.controller.bowCard(context.target);
            }
        });
    }
}

MirumotosFury.id = 'mirumoto-s-fury';

module.exports = MirumotosFury;
