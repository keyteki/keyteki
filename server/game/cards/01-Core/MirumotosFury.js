const DrawCard = require('../../drawcard.js');

class MirumotosFury extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow attacking character',
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.isAttacking() && card.getGlory() <= this.game.provinceCards.filter(card => (
                    card.facedown && card.controller === context.player
                )).length,
                gameAction: ability.actions.bow()
            }
        });
    }
}

MirumotosFury.id = 'mirumoto-s-fury';

module.exports = MirumotosFury;
