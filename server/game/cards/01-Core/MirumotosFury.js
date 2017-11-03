const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class MirumotosFury extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow attacking character',
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                gameAction: 'bow',
                cardCondition: card => card.isAttacking() && card.getGlory() <= _.size(this.game.allCards.filter(card => card.isProvince && card.facedown && card.controller === this.controller))
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to bow {2}', this.controller, this, context.target);
                this.controller.bowCard(context.target, context.source);
            }
        });
    }
}

MirumotosFury.id = 'mirumoto-s-fury';

module.exports = MirumotosFury;
